const { gunzipSync } = require('fflate')
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
      if (type === 'arraybuffer' && err.code === 'ENOENT') {
        return cb(null, null)
      } else {
        return cb(new Error('error evaluating fetching function'))
      }
    }
    if (response && Buffer.isBuffer(response)) {
      return cb(null, response)
    } else {
      if (response && response.status && (response.status === 200 || response.status === 206)) {
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
      const keys = listKeys(metadata)
      const isSharded = metadata.codecs[0].name == 'sharding_indexed'
      const separator = metadata.chunk_key_encoding.configuration.separator
      
      const getChunk = function (k, cb) {
        const key = k.join(separator)
        if (!keys.includes(key))
          return cb(new Error('storage key ' + key + ' not found', null))
        loader(path + '/c/' + key, {}, 'arraybuffer', (err, res) => {
          if (err) return cb(err)
          const chunk = parseChunk(res, metadata)
          cb(null, chunk)
        })
      }

      const getShardedChunk = async function (k, cb) {
      	const lookup = []
      	const arrayShape = metadata.shape
      	const chunkShape = metadata.chunk_grid.configuration.chunk_shape
      	for (let i = 0; i < arrayShape.length; i++) {
      		lookup.push(Math.floor(k[i] / chunkShape[i]))
      	}
      	const key = lookup.join(separator)
      	const src = path + '/c/' + key
      	const indexSize = 16 * metadata.codecs[0].configuration.chunk_shape
      		.map((d, i) => d * metadata.chunk_grid.configuration.chunk_shape[i])
      		.reduce((a, b) => a * b, 1)
      	console.log(indexSize)

      	if (!keys.includes(key))
          return cb(new Error('storage key ' + key + ' not found', null))

				request(src, { method: 'HEAD' }).then((res) => {
					const contentLength = res.headers.get('Content-Length')
					if (contentLength) {
						const fileSize = Number(contentLength)
						const startRange = fileSize > indexSize ? fileSize - indexSize : 0
						console.log(`bytes=${startRange}-${fileSize}`)
						loader(src, {headers: {'Range': `bytes=${startRange}-${fileSize}`}}, 'arraybuffer', (err, res) => {
							if (err) return cb(err)

							let dataView = new DataView(res);

							console.log(res)

			        // Create a BigUint64Array with correct length
			        let data = new BigUint64Array(res.byteLength / 8);
			        for (let i = 0; i < data.length; i++) {
			          // Get each 64-bit value in little-endian format
			          data[i] = dataView.getBigInt64(i * 8, true); // true for little-endian
			        }
							console.log(data)
							console.log(Buffer.isBuffer(res))
							//const index = new BigUint64Array(Buffer.from(res).buffer)
							//console.log(index)
						})
					}
				})
				

		
        // loader(, {}, 'arraybuffer'), (err, res) => {
        // 	if (err) return cb(err)
        // 	// extract index
        		
        // }

        // loader(path + '/c/' + key, {}, 'arraybuffer', (err, res) => {
        //   if (err) return cb(err)
        //   const chunk = parseChunk(res, metadata)
        //   cb(null, chunk)
        // })
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
  const parseChunk = (chunk, metadata) => {
  	const isSharded = metadata.codecs[0].name === 'sharding_indexed'
    if (chunk) {
      chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      if (metadata.codecs.length > 0) {
        if (
        	metadata.codecs[0].name === 'gzip' || 
        	(isSharded && metadata.codecs[0].configuration.codecs[0].name === 'gzip')
        ) {
          chunk = gunzipSync(chunk)
        } else {
          throw new Error(
            'compressor ' + metadata.codecs[0].name + ' is not supported'
          )
        }
      }
      const dtype = metadata.data_type
      chunk = new constructors[dtype](chunk.buffer)

    } else {
      const length = metadata.chunks.reduce((a, b) => a * b, 1)
      chunk = Array(length).fill(metadata.fill_value)
    }

    const chunkShape = isSharded ? 
    	metadata.codecs[0].configuration.chunk_shape :
    	metadata.chunk_grid.configuration.chunk_shape
    chunk = ndarray(chunk, chunkShape)
    return chunk
  }

  // list keys of all storage keys based on metadata
  const listKeys = (metadata) => {
    if (metadata.chunk_grid.name != 'regular') {
    	throw Error(`chunk grid ${metadata.chunk_grid.name} not supported`)
    }
    const arrayShape = metadata.shape
    const chunkShape = metadata.chunk_grid.configuration.chunk_shape
    const separator = metadata.chunk_key_encoding.configuration.separator
    return expandedProduct(arrayShape, chunkShape, separator)
  }

  const expandedProduct = (arrayShape, chunkShape, separator) => {
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

  const constructors = {
    'uint8': Uint8Array,
    'int16': Int16Array,
    'int32': Int32Array,
    'float32': Float32Array,
    'float64': Float64Array,
  }

  return {
    open: open,
  }
}

module.exports = zarr
