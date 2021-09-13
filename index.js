const pako = require('pako')
const ndarray = require('ndarray')
const ops = require('ndarray-ops')
const { parallel } = require('async')
const pool = require('ndarray-scratch')
const product = require('cartesian-product')

const zarr = (request) => {
  let loader
  request = request || (window.fetch ? window.fetch : null)
  if (!request) throw new Error('no request function defined')
  if (request.name === 'fetch') {
    loader = (src, type, cb) => request(src)
      .then(response => {
        if (response.status === 200) {
          if (type === 'text') {
            return response.text()
          } else if (type === 'arraybuffer') {
            return response.arrayBuffer()
          }
        } else {
          cb(new Error('resource not found'))
        }
      })
      .then(body => {
        if (!body) {
          cb(new Error('resource not found'))
        } else {
          cb(null, body)
        }
      })
  } else {
    loader = (src, type, cb) => request(src, { responseType: type }, (err, data) => {
      if ((err) | (!data)) return cb(new Error('resource not found'))
      return cb(null, data)
    })
  }

  const load = (path, cb, metadata) => {
    const onload = (metadata) => {
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
    }
    if (metadata) {
      onload(metadata)
    } else {
      loader(path + '/.zarray', 'text', (err, res) => {
        if (err) return cb(err)
        const metadata = parseMetadata(res)
        onload(metadata)
      })
    }
  }

  const open = (path, cb, metadata) => {
    const onload = (metadata) => {
      const keys = listKeys(metadata)
      metadata.keys = keys
      const getChunk = function (k, cb) {
        const key = k.join('.')
        if (!(keys.includes(key))) return cb(new Error('chunk ' + key + ' not found', null))
        loader(path + '/' + key, 'arraybuffer', (err, res) => {
          if (err) return cb(err)
          const chunk = parseChunk(res, metadata)
          cb(null, chunk)
        })
      }
      cb(null, getChunk)
    }
    if (metadata) {
      onload(metadata)
    } else {
      loader(path + '/.zarray', 'text', (err, res) => {
        if (err) return cb(err)
        const metadata = parseMetadata(res)
        onload(metadata)
      })
    }
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

  const loadList = (list, cb) => {
    const tasks = list.map((k) => {
      return function (cb) { load(k, cb) }
    })
    parallel(tasks, (err, result) => {
      if (err) return cb(err)
      cb(null, result)
    })
  }

  const openGroup = (path, cb) => {
    loader(path + '/.zmetadata', 'text', (err, res) => {
      if (err) return cb(err)
      const metadata = parseMetadata(res)
      if (!Object.keys(metadata).includes('zarr_consolidated_format')) {
        return cb(new Error('metadata is not consolidated', null))
      }
      const arrays = listArrays(metadata.metadata)
      const keys = Object.keys(arrays)
      const tasks = keys.map((k) => {
        return function (cb) { open(path + '/' + k, cb, arrays[k]) }
      })
      parallel(tasks, (err, result) => {
        if (err) return cb(err)
        const out = {}
        keys.forEach((k, i) => {
          out[k] = result[i]
        })
        cb(null, out, metadata)
      })
    })
  }

  const loadGroup = (path, cb, list) => {
    loader(path + '/.zmetadata', 'text', (err, res) => {
      if (err) return cb(err)
      const metadata = parseMetadata(res)
      if (!Object.keys(metadata).includes('zarr_consolidated_format')) {
        return cb(new Error('metadata is not consolidated', null))
      }
      const arrays = listArrays(metadata.metadata)
      let keys = Object.keys(arrays)
      if (list && list.length > 0) keys = keys.filter(k => list.includes(k))
      const tasks = keys.map((k) => {
        return function (cb) { load(path + '/' + k, cb, arrays[k]) }
      })
      parallel(tasks, (err, result) => {
        if (err) return cb(err)
        const out = {}
        keys.forEach((k, i) => {
          out[k] = result[i]
        })
        cb(null, out, metadata)
      })
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

  // list arrays
  const listArrays = (metadata) => {
    const keys = Object.keys(metadata).filter(k => k.includes('.zarray'))
    const out = {}
    keys.forEach(k => {
      out[k.replace('/.zarray', '')] = metadata[k]
    })
    return out
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
    openList: openList,
    loadList: loadList,
    openGroup: openGroup,
    loadGroup: loadGroup
  }
}

module.exports = zarr
