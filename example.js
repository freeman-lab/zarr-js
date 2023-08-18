const fs = require('fs/promises')
const fetch = require('node-fetch')
const zarr = require('./index.js')(fetch, 'v3')

// open an array and load chunks on demand
zarr.open('https://storage.googleapis.com/carbonplan-share/testing/zarr-js/v3/1d.chunked.compressed.sharded.i2.zarr', (err, get) => {
  get([0], function (err, array) {
    console.log(err)
    console.log(array.data)
  })
})