const fs = require('fs/promises')
const fetch = require('node-fetch')
const zarr = require('./index.js')(fetch, 'v3')

// // load an entire array
// zarr.load('example.zarr', (err, array) => {
//   console.log(array.data)
// })

// // open an array and load chunks on demand
// zarr.open('example.zarr', (err, get) => {
//   get([0], function (err, array) {
//     console.log(array.data)
//   })
// })

// // open a zarr group
// zarr.openGroup('example_group.zarr', (err, group) => {
//   group.a([0], function (err, array) {
//     console.log(array.data)
//   })
//   group.b([0], function (err, array) {
//     console.log(array.data)
//   })
// })

// // load an entire zarr group
// zarr.loadGroup('example_group.zarr', (err, group) => {
//   console.log(group.a.data)
//   console.log(group.b.data)
// })

// open an array and load chunks on demand
zarr.open('http://10.0.0.97:8080/v3/1d.chunked.compressed.i2.shards.zarr', (err, get) => {
  get([0], function (err, array) {
    console.log(array.data)
  })
})