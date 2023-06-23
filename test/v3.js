const test = require('tape')
const fs = require('fs/promises')
const fetch = require('node-fetch')
const zarrLocal = require('../index')(fs.readFile, 'v3')
const zarrRemote = require('../index')(fetch, 'v3')

const args = process.argv

const urlLocal = 'data/v3/'
const urlRemote = ''

if (args.includes('local')) {
  run(zarrLocal, urlLocal, 'local')
}
if (args.includes('remote')) {
  run(zarrRemote, urlRemote, 'remote')
}

function run(zarr, prefix, mode) {
  test('1d.chunked.compressed.i2' + `.${mode}`, function (t) {
    zarr.load(prefix + '1d.chunked.compressed.i2.zarr', (err, array) => {
      t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
      t.end()
    })
  })

  test('1d.chunked.compressed.i2.shards' + `.${mode}`, function (t) {
    zarr.load(prefix + '1d.chunked.compressed.i2.shards.zarr', (err, array) => {
      t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
      t.end()
    })
  })
}