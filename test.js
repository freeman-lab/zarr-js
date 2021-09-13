const test = require('tape')
const fs = require('fs')
const zarr = require('./index')(fs.readFile)

test('1d.chunked.compressed.i2', function (t) {
  zarr.load('data/1d.chunked.compressed.i2.zarr', (err, array) => {
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

test('1d.contiguous.compressed.i4', function (t) {
  zarr.load('data/1d.contiguous.compressed.i4.zarr', (err, array) => {
    t.deepEqual(array.data, new Int32Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.contiguous.compressed.u1', function (t) {
  zarr.load('data/1d.contiguous.compressed.u1.zarr', (err, array) => {
    t.deepEqual(array.data, new Uint8Array([255, 0, 255, 0]))
    t.end()
  })
})

test('1d.contiguous.compressed.f4', function (t) {
  zarr.load('data/1d.contiguous.compressed.f4.zarr', (err, array) => {
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

test('1d.contiguous.compressed.f8', function (t) {
  zarr.load('data/1d.contiguous.compressed.f8.zarr', (err, array) => {
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

test('1d.chunked.compressed.i2', function (t) {
  zarr.load('data/1d.chunked.compressed.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.end()
  })
})

test('1d.chunked.ragged.compressed.i2', function (t) {
  zarr.load('data/1d.chunked.ragged.compressed.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4, 5]))
    t.end()
  })
})

test('2d.contiguous.compressed.i2', function (t) {
  zarr.load('data/2d.contiguous.compressed.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.deepEqual(array.shape, [2, 2])
    t.end()
  })
})

test('2d.chunked.compressed.i2', function (t) {
  zarr.load('data/2d.chunked.compressed.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
    t.deepEqual(array.shape, [2, 2])
    t.end()
  })
})

test('2d.chunked.ragged.compressed.i2', function (t) {
  zarr.load('data/2d.chunked.ragged.compressed.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([1, 2, 3, 4, 5, 6, 7, 8, 9]))
    t.deepEqual(array.shape, [3, 3])
    t.end()
  })
})

test('3d.chunked.compressed.i2', function (t) {
  zarr.load('data/3d.chunked.compressed.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})

test('3d.contiguous.compressed.i2', function (t) {
  zarr.load('data/3d.contiguous.compressed.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})

test('3d.chunked.mixed.compressed.i2', function (t) {
  zarr.load('data/3d.chunked.mixed.compressed.i2.zarr', (err, array) => {
    t.deepEqual(array.data, new Int16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]))
    t.deepEqual(array.shape, [3, 3, 3])
    t.end()
  })
})

test('1d.contiguous.compressed.i2.group', function (t) {
  zarr.loadGroup('data/1d.contiguous.compressed.i2.group.zarr', (err, group) => {
    t.deepEqual(group.a.data, new Int16Array([1, 2, 3, 4]))
    t.deepEqual(group.b.data, new Int16Array([5, 6, 7, 8]))
    t.end()
  })
})

test('1d.contiguous.compressed.i2.group.list', function (t) {
  zarr.loadGroup('data/1d.contiguous.compressed.i2.group.zarr', (err, group) => {
    t.deepEqual(group.a.data, new Int16Array([1, 2, 3, 4]))
    t.equal(group.b, undefined)
    t.end()
  }, ['a'])
})
