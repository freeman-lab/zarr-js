const { gunzipSync, unzlibSync } = require('fflate')
const ndarray = require('ndarray')
const ops = require('ndarray-ops')
const { parallel } = require('async')
const pool = require('ndarray-scratch')
const product = require('cartesian-product')

const zarr = (request, config = {}) => {

  let useSuffixRequest = true
  if (config.hasOwnProperty('useSuffixRequest')) {
    useSuffixRequest = config.useSuffixRequest
  }

  if (!request) {
    request = window.fetch
  }
  if (!request) throw new Error('no request function defined')

  const loader = async (src, options, type, cb) => {
    let response
    try {
      response = await request(src, options)
    } catch (err) {
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
        [403, 404].includes(response.status)
      ) {
        return cb(null, null)
      } else {
        return cb(new Error('resource not found'))
      }
    }
  }

  const open = (path, cb, metadata) => {
    const indexCache = {}

    const onload = (metadata) => {
      const isSharded = metadata.codecs[0].name == 'sharding_indexed'
      const arrayShape = metadata.shape
      const chunkShape = isSharded
        ? metadata.codecs[0].configuration.chunk_shape
        : metadata.chunk_grid.configuration.chunk_shape
      const dataType = metadata.data_type
      const separator = metadata.chunk_key_encoding.configuration.separator
      const fillValue = metadata.fill_value
      const codec = isSharded
        ? metadata.codecs[0].configuration.codecs[0]
        : metadata.codecs[0]
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
        loader(path + '/c/' + key, {}, 'arraybuffer', (err, res) => {
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
          metadata.chunk_grid.configuration.chunk_shape.map((d, i) => {
            return d / chunkShape[i]
          })
        for (let i = 0; i < k.length; i++) {
          lookup.push(Math.floor(k[i] / chunksPerShard[i]))
        }
        const key = lookup.join(separator)
        const src = path + '/c/' + key
        const checksumSize = 4
        const indexSize =
          16 * chunksPerShard.reduce((a, b) => a * b, 1)
        if (!keys.includes(key))
          return cb(new Error('storage key ' + key + ' not found', null))

        // load a shard using the index
        const getUsingIndex = (index) => {
          // modulo index to get index for a single shard
          const reducedKey = k.map((d, i) => d % chunksPerShard[i])
          // linearize index
          const start = ndToLinearIndex(chunksPerShard, reducedKey)
          // write null chunk when 2^64-1 indicates fill value
          if (
            index[start * 2] === 18446744073709551615n &&
            index[start * 2 + 1] === 18446744073709551615n
          ) {
            const chunk = parseChunk(
              null,
              dataType,
              chunkShape,
              fillValue,
              codec
            )
            cb(null, chunk)
          } else {
            const range = `bytes=${index[start * 2]}-${
              parseInt(index[start * 2] + index[start * 2 + 1]) - 1
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
        }

        // load index from cache or fetch using file size
        if (indexCache[key]) {
          getUsingIndex(indexCache[key])
        } else {
          if (useSuffixRequest) { 
            loader(
              src,
              {
                headers: {
                  Range: `bytes=-${indexSize + checksumSize}`,
                },
              },
              'arraybuffer',
              (err, res) => {
                if (err) return cb(err)
                const index = new BigUint64Array(new Buffer.from(res).buffer.slice(0, indexSize))
                indexCache[key] = index
                getUsingIndex(indexCache[key])
              }
            )
          } else {
            request(src, { method: 'HEAD' }).then((res) => {
              const contentLength = res.headers.get('Content-Length')
              if (contentLength) {
                const fileSize = Number(contentLength)
                // get index byte range according to sharding spec
                const startRange = fileSize - (indexSize + checksumSize)
                loader(
                  src,
                  {
                    headers: {
                      Range: `bytes=${startRange}-${fileSize - checksumSize - 1}`,
                    },
                  },
                  'arraybuffer',
                  (err, res) => {
                    if (err) return cb(err)
                    const index = new BigUint64Array(Buffer.from(res).buffer)
                    indexCache[key] = index
                    getUsingIndex(indexCache[key])
                  }
                )
              }
            })
          }
        }
      }

      isSharded ? cb(null, getShardedChunk) : cb(null, getChunk)
    }
    if (metadata) {
      onload(metadata)
    } else {
      loader(path + '/zarr.json', {}, 'text', (err, res) => {
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
      if (codec.name == 'gzip') {
        chunk = gunzipSync(chunk)
      } else if (codec.name == 'blosc' && codec.configuration.cname == 'zlib') {
        chunk = unzlibSync(chunk)
      } else {
        throw new Error('compressor ' + compressor + ' is not supported')
      }
      chunk = new constructors[dtype](chunk.buffer)
    } else {
      const length = chunkShape.reduce((a, b) => a * b, 1)
      chunk = new constructors[dtype](length).fill(fillValue)
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

  const ndToLinearIndex = (shape, index) => {
    let stride = 1
    let linearIndex = 0
    for (let i = shape.length - 1; i >= 0; i--) {
      linearIndex += index[i] * stride
      stride *= shape[i]
    }
    return linearIndex
  }

  const constructors = {
    uint8: Uint8Array,
    int16: Int16Array,
    int32: Int32Array,
    float32: Float32Array,
    float64: Float64Array,
  }

  return {
    open: open,
  }
}

module.exports = zarr
