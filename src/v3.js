const { gunzipSync, unzlibSync } = require('fflate')
const ndarray = require('ndarray')
const ops = require('ndarray-ops')
const { parallel } = require('async')
const pool = require('ndarray-scratch')
const product = require('cartesian-product')

const zarr = (request) => {
  if (!request) {
    request = window.fetch
  }
  if (!request) throw new Error('no request function defined')

  const loader = async (src, options, type, cb) => {
    let response
    try {
      response = await request(src, options)
    } catch (err) {
      console.log(err)
      if (type === 'arraybuffer' && err.code === 'ENOENT') {
        return cb(null, null)
      } else {
        return cb(new Error('error evaluating fetching function'))
      }
    }
    if (response && Buffer.isBuffer(response)) {
      return cb(null, response)
    } else {
      if (
        response &&
        response.status &&
        (response.status === 200 || response.status === 206)
      ) {
        let body
        if (type === 'text') {
          body = await response.text()
        } else if (type === 'arraybuffer') {
          body = await response.arrayBuffer()
        } else {
          return cb(new Error('unsupported file format'))
        }
        if (!body) {
          return cb(new Error('failed to parse data'))
        } else {
          return cb(null, body)
        }
      } else if (
        type === 'arraybuffer' &&
        response &&
        response.status &&
        response.status === 404
      ) {
        return cb(null, null)
      } else {
        return cb(new Error('resource not found'))
      }
    }
  }

  const open = (path, cb, metadata) => {
    const onload = (metadata) => {
      const isSharded =
        metadata.storage_transformers &&
        metadata.storage_transformers[0].extension ==
          'https://purl.org/zarr/spec/storage_transformers/sharding/1.0' &&
        metadata.storage_transformers[0].type == 'indexed'
      const arrayShape = metadata.shape
      const chunkShape = isSharded
        ? metadata.chunk_grid.chunk_shape.map(
            (d, i) =>
              d *
              metadata.storage_transformers[0].configuration.chunks_per_shard[i]
          )
        : metadata.chunk_grid.chunk_shape
      const dataType = metadata.data_type
      const separator = metadata.chunk_grid.separator
      const fillValue = metadata.fill_value
      const codec = metadata.compressor.codec
      const keys = listKeys(arrayShape, chunkShape, separator)

      const getChunk = function (k, cb) {
        if (k.length != arrayShape.length || k.length != chunkShape.length) {
          return cb(
            new Error(
              'key dimensionality must match array shape and chunk shape'
            )
          )
        }
        const key = k.join(separator)
        if (!keys.includes(key))
          return cb(new Error('storage key ' + key + ' not found', null))

        // fetch the chunk
        loader(path + '/data/root/c' + key, {}, 'arraybuffer', (err, res) => {
          if (err) return cb(err)
          const chunk = parseChunk(res, dataType, chunkShape, fillValue, codec)
          cb(null, chunk)
        })
      }

      const getShardedChunk = async function (k, cb) {
        if (k.length != arrayShape.length || k.length != chunkShape.length) {
          return cb(
            new Error(
              'key dimensionality must match array shape and chunk shape'
            )
          )
        }
        const lookup = []
        const chunksPerShard =
          metadata.storage_transformers[0].configuration.chunks_per_shard
        for (let i = 0; i < k.length; i++) {
          lookup.push(Math.floor(k[i] / chunkShape[i]))
        }
        const key = lookup.join(separator)
        const src = path + '/data/root/c' + key
        const indexSize = 16 * chunksPerShard.reduce((a, b) => a * b, 1)
        if (!keys.includes(key))
          return cb(new Error('storage key ' + key + ' not found', null))

        // use an initial fetch to get file size
        request(src, { method: 'HEAD' }).then((res) => {
          const contentLength = res.headers.get('Content-Length')
          if (contentLength) {
            const fileSize = Number(contentLength)
            // get index byte range according to sharding spec
            const startRange = fileSize > indexSize ? fileSize - indexSize : 0
            loader(
              src,
              { headers: { Range: `bytes=${startRange}-${fileSize}` } },
              'arraybuffer',
              (err, res) => {
                if (err) return cb(err)
                const index = new BigUint64Array(Buffer.from(res).buffer)
                // index into the index to load the requested chunk
                const start = k
                  .map((d, i) => d % chunksPerShard[i]) // express for a single shard
                  .map((d, i) =>
                    i == chunksPerShard.length - 1 ? d : d * chunksPerShard[i]
                  )
                  .reduce((a, b) => a + b, 0) // convert to linear index
                const range = `bytes=${index[start * 2]}-${
                  index[start * 2] + index[start * 2 + 1]
                }`
                // finally load the chunk
                loader(
                  src,
                  { headers: { Range: range } },
                  'arraybuffer',
                  (err, res) => {
                    if (err) return cb(err)
                    const chunk = parseChunk(
                      res,
                      dataType,
                      chunkShape,
                      fillValue,
                      codec
                    )
                    cb(null, chunk)
                  }
                )
              }
            )
          }
        })
      }

      isSharded ? cb(null, getShardedChunk) : cb(null, getChunk)
    }
    if (metadata) {
      onload(metadata)
    } else {
      loader(path + '/meta/root.array.json', {}, 'text', (err, res) => {
        if (err) return cb(err)
        const metadata = parseMetadata(res)
        onload(metadata)
      })
    }
  }

  // parse json metadata
  const parseMetadata = (json) => {
    return JSON.parse(json)
  }

  // parse a single zarr chunk
  const parseChunk = (chunk, dtype, chunkShape, fillValue, codec) => {
    if (chunk) {
      chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      if (codec == 'https://purl.org/zarr/spec/codec/gzip/1.0') {
        chunk = gunzipSync(chunk)
      } else if (codec == 'https://purl.org/zarr/spec/codec/zlib/1.0') {
        chunk = unzlibSync(chunk)
      } else {
        throw new Error('compressor ' + compressor + ' is not supported')
      }
      chunk = new constructors[dtype](chunk.buffer)
    } else {
      const length = chunkShape.reduce((a, b) => a * b, 1)
      chunk = Array(length).fill(fillValue)
    }
    chunk = ndarray(chunk, chunkShape)
    return chunk
  }

  // list all storage keys based on shape properties
  const listKeys = (arrayShape, chunkShape, separator) => {
    const zipped = []
    for (let i = 0; i < arrayShape.length; i++) {
      const counts = []
      let iter = 0
      let total = 0
      // add chunks until we exceed shape
      while (total < arrayShape[i]) {
        counts.push(iter)
        total += chunkShape[i]
        iter += 1
      }
      zipped.push(counts)
    }
    return product(zipped).map((name) => name.join(separator))
  }

  function StringArray(size, bytes) {
    return (buffer) => {
      const count = buffer.byteLength / (size * bytes)
      const array = []
      for (let s = 0; s < count; s++) {
        const subuffer = buffer.slice(s * bytes * size, (s + 1) * bytes * size)
        const substring = []
        for (let c = 0; c < size; c++) {
          const parsed = Buffer.from(
            subuffer.slice(c * bytes, (c + 1) * bytes)
          ).toString('utf8')
          substring.push(parsed.replace(/\x00/g, ''))
        }
        array.push(substring.join(''))
      }
      return array
    }
  }

  function BoolArray(buffer) {
    const result = new Uint8Array(buffer)
    return Array.from(result).map((d) => d === 1)
  }

  const constructors = {
    u1: Uint8Array,
    '<i2': Int16Array,
    '<i4': Int32Array,
    '<f4': Float32Array,
    '<f8': Float64Array,
  }

  return {
    open: open,
  }
}

module.exports = zarr
