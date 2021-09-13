# zarr-js

> load chunked binary zarr files in javascript

[zarr](https://zarr.readthedocs.io/en/stable/) is a chunked binary format for storing n-dimensional arrays with great support for parallel access in cloud environments. This is a super minimal library for reading zarr files in javascript. It only supports array reading with either no compression or `zlib` compression and `C` order little endian arrays. No support for groups. It returns [`scijs/ndarray`](https://github.com/scijs/ndarray) objects. We're primarily using it for visualization with `regl` and `webgl`.

It also appears another attempt at this was recently started [here](https://github.com/gzuidhof/zarr.js)! It seems to aim to be more feature complete, less opinionated, and a bit more complex. It might be better for your needs, check it out.

## install

Add to your project with

```
npm install zarr-js
```

## example

You need to wrap a module for making requests. For most use cases in the browser you can use `fetch`, which is the default if nothing is passed. You can also use [`xhr-request`](https://github.com/Jam3/xhr-request) for remote files in `node` or the `browser`, or `fs.readFile` for local files in `node`. We'll use `fs.readFile` in these examples.

The `load` method loads the entire file. 

```js
const fs = require('fs')
const zarr = require('zarr-js')(fs.readFile)

zarr.load('example.zarr', (err, array) => {
  console.log(array.data)
})

>> Int16Array [ 1, 2, 3, 4 ]
```

The `open` method can instead be used to read only the metadata and then load individual chunks on demand. This is useful in applications where you want to laziliy load chunks, e.g. tiles in a map viewer.

```js
const fs = require('fs')
const zarr = require('zarr-js')(fs.readFile)

zarr.open('example.zarr', (err, get) => {
  get([0], (err, array) => {
    console.log(array.data)
  })
})

>> Int16Array [ 1, 2, 3, 4 ]
```

The `loadGroup` and `openGroup` are similar but work on `zarr` groups with consolidated metadata. These are hierarchical data structures typically used to store multiple related arrays.

```js
const fs = require('fs')
const zarr = require('zarr-js')(fs.readFile)

zarr.loadGroup('example_group.zarr', (err, group) => {
  console.log(group.a.data)
  console.log(group.b.data)
})

>> Int16Array [ 1, 2, 3, 4 ]
>> Int16Array [ 5, 6, 7, 8 ]
```

## api

There are six methods

#### `zarr.load(uri, [callback], [metadata])`

Loads a zarr file and passes the result to the `callback`. If the file contains multiple chunks, they are merged. This is the simplest way to load an array. If metadata has already been loaded, it can be passed as an optional third argument to avoid making the request.

#### `zarr.open(uri, [callback], [metadata])`

Opens a zarr file and passes a function to the `callback` that can then be used to load individual chunks based on their key. This is useful for laziliy loading chunks (e.g. tiles in a map viewer). The result is a function that can be used to load chunks of the array. If metadata has already been loaded, it can be passed as an optional third argument to avoid making the request.

#### `zarr.openGroup(uri, [callback], [metadata])`

Opens consolidated metadata for a zarr group, which is typically a collection of zarr arrays. All the metadata for all arrays are loaded at the start, so this is useful when lazily loading chunks from multiple sources (e.g. different layers of a map viewer). The result passed to the `callback` is an object with keys as array names and values as functions that can be used to load chunks. If metadata has already been loaded, it can be passed as an optional third argument to avoid making the request.

#### `zarr.loadGroup(uri, [callback], [list], [metadata])`

Loads consolidated metadata for a zarr group, which is typically a collection of zarr arrays. All the metadata for all arrays are loaded at the start, so this is useful when lazily loading chunks from multiple sources (e.g. different layers of a map viewer). The result passed to the `callback` is an object with keys as array names and values as arrays. An optional list of array names can be passed if you only want to load a subset. If metadata has already been loaded, it can be passed as an optional fourth argument to avoid making the request.

#### `zarr.openList(uri, [callback])`

Opens a list of zarr files and passes a list of functions to the `callback` each of which can be used to load invidiaul chunks based on their key. All the metadata for all files are loaded at the start, so this is useful when lazily loading chunks from multiple sources (e.g. different layers of a map viewer).

#### `zarr.loadList(uri, [callback])`

Loads a list of zarr files and passes a list of arrays to the `callback` each of which can be used to load invidiaul chunks based on their key. All the metadata for all files are loaded at the start, so this is useful when lazily loading chunks from multiple sources (e.g. different layers of a map viewer).


## tests

To run the tests, generate the example data from Python by running

```
python generate.py
```

and then run the tests using

```
node tests.js
```

The python script assumes you have `zarr` and `numpy` installed in your Python environment.