# zarr-js

> load chunked binary zarr files in javascript

[Zarr](https://zarr.readthedocs.io/en/stable/) is a chunked binary format for storing n-dimensional arrays with great support for parallel access in cloud environments. This is a minimal library purely for reading Zarr files in Javascript. Other libraries exist with more features, and might suit you better! 

This library was originally developed for Zarr v2, but we've recently added experimental support for [Zarr v3](https://zarr-specs.readthedocs.io/en/latest/v3/core/v3.0.html), including support for [sharding](https://zarr-specs.readthedocs.io/en/latest/v3/codecs/sharding-indexed/v1.0.html), which is useful for visualization use cases. See "V3 support" below for more details.

## install

Add to your project with

```
npm install zarr-js
```

## example

You need to wrap a module for making async requests. For most use cases in the browser you can use `fetch`, which is the default if nothing is passed. You can also use `fsPromises.readFile` for local files in `node`. We'll use `fsPromises.readFile` in these examples.

The `load` method loads the entire array. 

```js
const fs = require('fs/promises')
const zarr = require('zarr-js')(fs.readFile)

zarr.load('example.zarr', (err, array) => {
  console.log(array.data)
})

>> Int16Array [ 1, 2, 3, 4 ]
```

The `open` method can instead be used to read only the metadata and then load individual chunks on demand based on their key. This is useful in applications where you want to load chunks laziliy, e.g. tiles in a map viewer.

```js
const fs = require('fs/promises')
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
const fs = require('fs/promises')
const zarr = require('zarr-js')(fs.readFile)

zarr.loadGroup('example_group.zarr', (err, group) => {
  console.log(group.a.data)
  console.log(group.b.data)
})

>> Int16Array [ 1, 2, 3, 4 ]
>> Int16Array [ 5, 6, 7, 8 ]
```

## v3 support

We recently added experimental support for [Zarr v3](https://zarr.readthedocs.io/en/stable/spec/v3.html), including support for sharding, which makes it possible to define chunks that are smaller than their containing storage objects via [sharding](https://zarr-specs.readthedocs.io/en/latest/v3/codecs/sharding-indexed/v1.0.html). This can be especially useful in visualization applications where you want to load small portions of data on demand without creating an excessive number of files.

To use v3 specify the optional version tag `'v3'` (the default is `'v2'`)

```js
const zarr = require('zarr-js')(window.fetch, 'v3')
```

Currently, the only supported method is `zarr.open`, which reads the metadata and then can load individual chunks on demand via the `get` method. For non-sharded data, this should behave similarly to Zarr v2. For sharded data, the `key` argument to the `get` method uses byte range requests to load chunks from within shards.

Here's a simple worked example. For a non-sharded 4x4 array with 2x2 chunks, calling `get([0,0])` will return a 2x2 array with the entries `[0:2,0:2]` from the original array. For a sharded 4x4 array with 2x2 shards and 1x1 chunks, calling `get([0,0])` will return a 1x1 array with the entries `[0:1,0:1]` from the original array.

You can additionally pass a configuration object for some v3 specific configuration. Current options include `useSuffixRequest` which is `true` by default and will use a suffix request to get the shard index instead of using a sequence of a HEAD request to get file size and then a byte range request. Most large object stores (e.g. S3, GCS, Azure) support suffix requests, but you may need to turn it off for other http servers.

## api

This documentation is for the v2 version only (for the v3 version only the `open` method is supported).

#### `zarr.load(uri, [callback], [metadata])`

Loads a zarr file and passes the result to the `callback`. If the file contains multiple chunks, they are merged. This is the simplest way to load an array. If metadata has already been loaded, it can be passed as an optional third argument to avoid making the request.

#### `zarr.open(uri, [callback], [metadata])`

Opens a zarr file and passes a function to the `callback` that can then be used to load individual chunks based on their key. This is useful for laziliy loading chunks (e.g. tiles in a map viewer). The result is a function that can be used to load chunks of the array. If metadata has already been loaded, it can be passed as an optional third argument to avoid making the request.

#### `zarr.loadGroup(uri, [callback], [list], [metadata])`

Loads all arrays with consolidated metadata from a zarr group, which is typically a collection of related arrays. The result passed to the `callback` is an object with keys as array names and values as arrays. An optional list of array names can be passed if you know you only want to load a subset. If metadata has already been loaded, it can be passed as an optional fourth argument to avoid making the request.

#### `zarr.openGroup(uri, [callback], [list], [metadata])`

Opens consolidated metadata for a zarr group, which is typically a collection of related arrays. Only the metadata is loaded, so this is useful when lazily loading chunks from multiple sources. The result passed to the `callback` is an object with keys as array names and values as functions that can be used to load chunks. An optional list of array names can be passed if you only want to return a subset of keys. If metadata has already been loaded, it can be passed as an optional fourth argument to avoid making the request.


## tests

To run the tests, generate the example data from Python by running

```
rm -rf data
python generate.py
```

and then run the tests using

```
node tests.js
```

The python script assumes you have `zarr` and `numpy` installed in your Python environment.