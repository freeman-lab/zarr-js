const fs = require('fs')
const zarr = require('./index.js')(fs.readFile)

// load the entire array
zarr.load('example.zarr', (err, array) => {
  console.log(array.data)
})

// open the array and load chunks on demand
zarr.open('example.zarr', (err, get) => {
  get([0], function (err, array) {
    console.log(array.data)
  })
})

// open multiple arrays
let sources = [
  'example.zarr',
  'example.zarr'
]
zarr.openList(sources, (err, arrays) => {
  arrays[0]([0], function (err, array) {
    console.log(array.data)
  })
  arrays[1]([0], function (err, array) {
    console.log(array.data)
  })
})