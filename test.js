const test = require('tape')
const fs = require('fs')
const zarr = require('./index')(fs.readFile)

test('1d.chunked.zlib.i2', function (t) {
  zarr.load('data/1d.chunked.zlib.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.chunked.gzip.i2', function (t) {
  zarr.load('data/1d.chunked.gzip.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.chunked.blosc.i2', function (t) {
  zarr.load('data/1d.chunked.blosc.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.contiguous.uncompressed.i2', function (t) {
  zarr.load('data/1d.contiguous.uncompressed.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.contiguous.zlib.i4', function (t) {
  zarr.load('data/1d.contiguous.zlib.i4.zarr', (err, array) => {
    t.deepEqual(array.data, new Int32Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.contiguous.gzip.i4', function (t) {
  zarr.load('data/1d.contiguous.gzip.i4.zarr', (err, array) => {
    t.deepEqual(array.data, new Int32Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.contiguous.blosc.i4', function (t) {
  zarr.load('data/1d.contiguous.blosc.i4.zarr', (err, array) => {
    t.deepEqual(array.data, new Int32Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.contiguous.zlib.u1', function (t) {
  zarr.load('data/1d.contiguous.zlib.u1.zarr', (err, array) => {
    t.deepEqual(array.data, new Uint8Array([255, 0, 255, 0]))
    t.end()
  })
})

test('1d.contiguous.gzip.u1', function (t) {
  zarr.load('data/1d.contiguous.gzip.u1.zarr', (err, array) => {
    t.deepEqual(array.data, new Uint8Array([255, 0, 255, 0]))
    t.end()
  })
})

test('1d.contiguous.blosc.u1', function (t) {
  zarr.load('data/1d.contiguous.blosc.u1.zarr', (err, array) => {
    t.deepEqual(array.data, new Uint8Array([255, 0, 255, 0]))
    t.end()
  })
})

test('1d.contiguous.zlib.f4', function (t) {
  zarr.load('data/1d.contiguous.zlib.f4.zarr', (err, array) => {
    t.deepEqual(array.data, new Float32Array([-1000.5, 0, 1000.5, 0]))
    t.end()
  })
})

test('1d.contiguous.gzip.f4', function (t) {
  zarr.load('data/1d.contiguous.gzip.f4.zarr', (err, array) => {
    t.deepEqual(array.data, new Float32Array([-1000.5, 0, 1000.5, 0]))
    t.end()
  })
})

test('1d.contiguous.blosc.f4', function (t) {
  zarr.load('data/1d.contiguous.blosc.f4.zarr', (err, array) => {
    t.deepEqual(array.data, new Float32Array([-1000.5, 0, 1000.5, 0]))
    t.end()
  })
})

test('1d.contiguous.uncompressed.i4', function (t) {
  zarr.load('data/1d.contiguous.uncompressed.i4.zarr', (err, array) => {
    t.deepEqual(array.data, new Int32Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.contiguous.zlib.f8', function (t) {
  zarr.load('data/1d.contiguous.zlib.f8.zarr', (err, array) => {
    t.deepEqual(array.data, new Float64Array([1.5, 2.5, 3.5, 4.5]))
    t.end()
  })
})

test('1d.contiguous.gzip.f8', function (t) {
  zarr.load('data/1d.contiguous.gzip.f8.zarr', (err, array) => {
    t.deepEqual(array.data, new Float64Array([1.5, 2.5, 3.5, 4.5]))
    t.end()
  })
})

test('1d.contiguous.blosc.f8', function (t) {
  zarr.load('data/1d.contiguous.blosc.f8.zarr', (err, array) => {
    t.deepEqual(array.data, new Float64Array([1.5, 2.5, 3.5, 4.5]))
    t.end()
  })
})

test('1d.contiguous.uncompressed.f8', function (t) {
  zarr.load('data/1d.contiguous.uncompressed.f8.zarr', (err, array) => {
    t.deepEqual(array.data, new Float64Array([1.5, 2.5, 3.5, 4.5]))
    t.end()
  })
})

test('1d.chunked.zlib.i2', function (t) {
  zarr.load('data/1d.chunked.zlib.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.chunked.gzip.i2', function (t) {
  zarr.load('data/1d.chunked.gzip.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.chunked.blosc.i2', function (t) {
  zarr.load('data/1d.chunked.blosc.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.chunked.ragged.zlib.i2', function (t) {
  zarr.load('data/1d.chunked.ragged.zlib.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4, 5]))
    t.end()
  })
})

test('1d.chunked.ragged.gzip.i2', function (t) {
  zarr.load('data/1d.chunked.ragged.gzip.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4, 5]))
    t.end()
  })
})

test('1d.chunked.ragged.blosc.i2', function (t) {
  zarr.load('data/1d.chunked.ragged.blosc.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4, 5]))
    t.end()
  })
})

test('2d.contiguous.zlib.i2', function (t) {
  zarr.load('data/2d.contiguous.zlib.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.deepEqual(array.shape, [2, 2])
    t.end()
  })
})

test('2d.contiguous.gzip.i2', function (t) {
  zarr.load('data/2d.contiguous.gzip.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.deepEqual(array.shape, [2, 2])
    t.end()
  })
})

test('2d.contiguous.blosc.i2', function (t) {
  zarr.load('data/2d.contiguous.blosc.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.deepEqual(array.shape, [2, 2])
    t.end()
  })
})

test('2d.chunked.zlib.i2', function (t) {
  zarr.load('data/2d.chunked.zlib.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.deepEqual(array.shape, [2, 2])
    t.end()
  })
})

test('2d.chunked.gzip.i2', function (t) {
  zarr.load('data/2d.chunked.gzip.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.deepEqual(array.shape, [2, 2])
    t.end()
  })
})

test('2d.chunked.blosc.i2', function (t) {
  zarr.load('data/2d.chunked.blosc.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.deepEqual(array.shape, [2, 2])
    t.end()
  })
})

test('2d.chunked.ragged.zlib.i2', function (t) {
  zarr.load('data/2d.chunked.ragged.zlib.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    t.deepEqual(array.shape, [3, 3])
    t.end()
  })
})

test('2d.chunked.ragged.gzip.i2', function (t) {
  zarr.load('data/2d.chunked.ragged.gzip.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    t.deepEqual(array.shape, [3, 3])
    t.end()
  })
})

test('2d.chunked.ragged.blosc.i2', function (t) {
  zarr.load('data/2d.chunked.ragged.blosc.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    t.deepEqual(array.shape, [3, 3])
    t.end()
  })
})

test('3d.chunked.zlib.i2', function (t) {
  zarr.load('data/3d.chunked.zlib.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})

test('3d.chunked.gzip.i2', function (t) {
  zarr.load('data/3d.chunked.gzip.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})

test('3d.chunked.blosc.i2', function (t) {
  zarr.load('data/3d.chunked.blosc.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})

test('3d.contiguous.zlib.i2', function (t) {
  zarr.load('data/3d.contiguous.zlib.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})

test('3d.contiguous.gzip.i2', function (t) {
  zarr.load('data/3d.contiguous.gzip.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})

test('3d.contiguous.blosc.i2', function (t) {
  zarr.load('data/3d.contiguous.blosc.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})

test('3d.chunked.mixed.zlib.i2', function (t) {
  zarr.load('data/3d.chunked.mixed.zlib.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})

test('3d.chunked.mixed.gzip.i2', function (t) {
  zarr.load('data/3d.chunked.mixed.gzip.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})

test('3d.chunked.mixed.blosc.i2', function (t) {
  zarr.load('data/3d.chunked.mixed.blosc.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})
