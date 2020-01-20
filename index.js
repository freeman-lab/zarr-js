const pako = require('pako')
const ndarray = require('ndarray')
const ops = require('ndarray-ops')
const { parallel } = require('async')
const pool = require('ndarray-scratch')
const product = require('cartesian-product')

const zarr = (request) => {
  const loader = (src, type, cb) => {
    return request(src, { responseType: type }, (err, data) => {
      if ((err) | (!data)) return cb(new Error('Error: resource not found'))
      return cb(null, data)
    })
  }

  const load = (path, cb) => {
    loader(path + '/.zarray', 'text', (err, res) => {
      if (err) return cb(err)
      const metadata = parseMetadata(res)
      const keys = listKeys(metadata)
      const tasks = keys.map((k) => {
        const fetchChunk = (cb) => {
          loader(path + '/' + k, 'arraybuffer', (err, res) => {
            if (err) return cb(err)
            const result = {}
            result[k] = parseChunk(res, metadata)
            cb(null, result)
          })
        }
        return fetchChunk
      })
      parallel(tasks, (err, chunks) => {
        if (err) return cb(err)
        cb(null, mergeChunks(chunks, metadata))
      })
    })
  }

  const open = (path, cb) => {
    loader(path + '/.zarray', 'text', (err, res) => {
      if (err) return cb(err)
      const metadata = parseMetadata(res)
      const keys = listKeys(metadata)
      metadata.keys = keys
      const _cache = {}
      const _loading = {}
      keys.forEach((k) => {
        _cache[k] = null
        _loading[k] = null
      })

      const getChunk = function (k, cb) {
        const key = k.join('.')
        if (!(keys.includes(key))) return cb(new Error('Error: chunk ' + key + ' not found', null))
        if (_cache[k]) {
          return cb(null, _cache[k])
        } else {
          if (_loading[k]) {
            const message = 'still loading'
            return cb(message)
          } else {
            _loading[k] = true
          }
        }

        loader(path + '/' + key, 'arraybuffer', (err, res) => {
          if (err) return cb(err)
          const chunk = parseChunk(res, metadata)
          if (!_cache[k]) _cache[k] = chunk
          if (_loading[k]) _loading[k] = false
          cb(null, chunk)
        })
      }
      cb(null, getChunk)
    })
  }

  const openList = (list, cb) => {
    const tasks = list.map((k) => {
      return function (cb) { open(k, cb) }
    })
    parallel(tasks, (err, result) => {
      if (err) return cb(err)
      cb(null, result)
    })
  }

  // parse json metadata
  const parseMetadata = (json) => {
    return JSON.parse(json)
  }

  // parse a single zarr chunk
  const parseChunk = (chunk, metadata) => {
    if (metadata.compressor) {
      if (metadata.compressor.id === 'zlib') {
        chunk = pako.inflate(chunk)
      } else {
        throw new Error('compressor ' + metadata.compressor.id + ' is not supported')
      }
    }
    chunk = new constructors[metadata.dtype](chunk.buffer)
    chunk = ndarray(chunk, metadata.chunks)
    return chunk
  }

  // merge chunks into an array
  const mergeChunks = (chunks, metadata) => {
    const dtype = Object.values(chunks[0])[0].dtype
    // get shape as exact multiple of chunks by rounding
    const shape = metadata.shape.map((d, i) => {
      const c = metadata.chunks[i]
      return Math.floor(d / c) * c + ((d % c) > 0) * c
    })
    // create new array to store merged chunks
    const merged = pool.zeros(shape, dtype)
    // loop over chunks inserting into array based on key
    chunks.forEach((chunk) => {
      const key = Object.keys(chunk)[0].split('.').map((k) => parseInt(k))
      const value = Object.values(chunk)[0]
      const lo = key.map((k, i) => k * metadata.chunks[i])
      const hi = metadata.chunks
      let view = merged.lo.apply(merged, lo)
      view = view.hi.apply(view, hi)
      ops.assign(view, value)
    })
    // truncate final array if needed
    if (metadata.shape.every((d, i) => d === merged.shape[i])) {
      return merged
    } else {
      const result = pool.zeros(metadata.shape, dtype)
      ops.assign(result, merged.hi.apply(merged, metadata.shape))
      pool.free(merged)
      return result
    }
  }

  // list keys of all zarr chunks based on metadata
  const listKeys = (metadata) => {
    const zipped = []
    // loop over dimensions
    for (let i = 0; i < metadata.shape.length; i++) {
      const counts = []
      let iter = 0
      let total = 0
      // add chunks until we exceed shape
      while (total < metadata.shape[i]) {
        counts.push(iter)
        total += metadata.chunks[i]
        iter += 1
      }
      zipped.push(counts)
    }
    const keys = product(zipped).map(name => name.join('.'))
    return keys
  }

  const constructors = {
    '<i1': Int8Array,
    '<u1': Uint8Array,
    '|u1': Uint8Array,
    '<i2': Int16Array,
    '<u2': Uint16Array,
    '<i4': Int32Array,
    '<u4': Uint32Array,
    '<f4': Float32Array,
    '<f8': Float64Array
  }

  return {
    load: load,
    open: open,
    openList: openList
  }
}

module.exports = zarr
