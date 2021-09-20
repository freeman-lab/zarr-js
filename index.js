const { unzlibSync } = require('fflate')
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

  const loader = async (src, type, cb) => {
    let response
    try {
      response = await request(src)
    } catch (err) {
      return cb(new Error('error evaluating fetching function'))
    }
    if (response && Buffer.isBuffer(response)) {
      return cb(null, response)
    } else {
      if ((response && response.status) && (response.status === 200)) {
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
      } else {
        return cb(new Error('resource not found'))
      }
    }
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

  const openGroup = (path, cb, list, metadata) => {
    const onload = (metadata) => {
      if (!Object.keys(metadata).includes('zarr_consolidated_format')) {
        return cb(new Error('metadata is not consolidated', null))
      }
      const arrays = listArrays(metadata.metadata)
      let keys = Object.keys(arrays)
      if (list && list.length > 0) keys = keys.filter(k => list.includes(k))
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
    }
    if (metadata) {
      onload(metadata)
    } else {
      loader(path + '/.zmetadata', 'text', (err, res) => {
        if (err) return cb(err)
        const metadata = parseMetadata(res)
        onload(metadata)
      })
    }
  }

  const loadGroup = (path, cb, list, metadata) => {
    const onload = (metadata) => {
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
    }
    if (metadata) {
      onload(metadata)
    } else {
      loader(path + '/.zmetadata', 'text', (err, res) => {
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
    if (metadata.compressor) {
      if (metadata.compressor.id === 'zlib') {
        chunk = unzlibSync(chunk)
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
    openGroup: openGroup,
    loadGroup: loadGroup
  }
}

module.exports = zarr
