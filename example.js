const fs = require('fs')
const zarr = require('./index.js')(fs.readFile)

// load an entire array
zarr.load('example.zarr', (err, array) => {
  console.log(array.data)
})

// open an array and load chunks on demand
zarr.open('example.zarr', (err, get) => {
  get([0], function (err, array) {
    console.log(array.data)
  })
})

// open a zarr group
zarr.openGroup('example_group.zarr', (err, group) => {
  group['a']([0], function (err, array) {
    console.log(array.data)
  })
  group['b']([0], function (err, array) {
    console.log(array.data)
  })
})

// load an entire zarr group
zarr.loadGroup('example_group.zarr', (err, group) => {
  console.log(group.a.data)
  console.log(group.b.data)
})

// open a list of arrays
zarr.openList(['example.zarr', 'example.zarr'], (err, loader) => {
  loader[0]([0], function (err, array) {
    console.log(array.data)
  })
  loader[1]([0], function (err, array) {
    console.log(array.data)
  })
})

// load a list of arrays
zarr.loadList(['example.zarr', 'example.zarr'], (err, arrays) => {
  console.log(arrays[0].data)
  console.log(arrays[1].data)
})
