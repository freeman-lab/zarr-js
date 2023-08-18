const test = require('tape')
const fs = require('fs/promises')
const fetch = require('node-fetch')
const zarrLocal = require('../index')(fetch, 'v3', {useSuffixRequest: false})
const zarrRemote = require('../index')(fetch, 'v3')

const args = process.argv

const urlLocal = 'http://localhost:8080/v3/'
const urlRemote =
  'https://storage.googleapis.com/carbonplan-share/testing/zarr-js/v3/'

if (args.includes('local')) {
  run(zarrLocal, urlLocal, 'local')
}
if (args.includes('remote')) {
  run(zarrRemote, urlRemote, 'remote')
}

function run(zarr, prefix, mode) {
  test('1d.chunked.compressed.i2' + `.${mode}`, function (t) {
    zarr.open(prefix + '1d.chunked.compressed.i2.zarr', (err, get) => {
      t.plan(2)
      get([0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([1, 2]))
      })
      get([1], (err, array) => {
        t.deepEqual(array.data, new Int16Array([3, 4]))
      })
    })
  })

  test('1d.chunked.compressed.sharded.i2' + `.${mode}`, function (t) {
    zarr.open(prefix + '1d.chunked.compressed.sharded.i2.zarr', (err, get) => {
      t.plan(4)
      get([0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([1]))
      })
      get([1], (err, array) => {
        t.deepEqual(array.data, new Int16Array([2]))
      })
      get([2], (err, array) => {
        t.deepEqual(array.data, new Int16Array([3]))
      })
      get([3], (err, array) => {
        t.deepEqual(array.data, new Int16Array([4]))
      })
    })
  })

  test('1d.contiguous.compressed.i2' + `.${mode}`, function (t) {
    zarr.open(prefix + '1d.contiguous.compressed.i2.zarr', (err, get) => {
      get([0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
        t.end()
      })
    })
  })

  test('1d.contiguous.compressed.sharded.i2' + `.${mode}`, function (t) {
    zarr.open(
      prefix + '1d.contiguous.compressed.sharded.i2.zarr',
      (err, get) => {
        get([0], (err, array) => {
          t.deepEqual(array.data, new Int16Array([1, 2, 3, 4]))
          t.end()
        })
      }
    )
  })

  test('1d.contiguous.compressed.i4' + `.${mode}`, function (t) {
    zarr.open(prefix + '1d.contiguous.compressed.i4.zarr', (err, get) => {
      get([0], (err, array) => {
        t.deepEqual(array.data, new Int32Array([1, 2, 3, 4]))
        t.end()
      })
    })
  })

  test('1d.contiguous.compressed.sharded.i4' + `.${mode}`, function (t) {
    zarr.open(
      prefix + '1d.contiguous.compressed.sharded.i4.zarr',
      (err, get) => {
        get([0], (err, array) => {
          t.deepEqual(array.data, new Int32Array([1, 2, 3, 4]))
          t.end()
        })
      }
    )
  })

  test('1d.contiguous.compressed.u1' + `.${mode}`, function (t) {
    zarr.open(prefix + '1d.contiguous.compressed.u1.zarr', (err, get) => {
      get([0], (err, array) => {
        t.deepEqual(array.data, new Uint8Array([255, 0, 255, 0]))
        t.end()
      })
    })
  })

  test('1d.contiguous.compressed.sharded.u1' + `.${mode}`, function (t) {
    zarr.open(
      prefix + '1d.contiguous.compressed.sharded.u1.zarr',
      (err, get) => {
        get([0], (err, array) => {
          t.deepEqual(array.data, new Uint8Array([255, 0, 255, 0]))
          t.end()
        })
      }
    )
  })

  test('1d.contiguous.compressed.f4' + `.${mode}`, function (t) {
    zarr.open(prefix + '1d.contiguous.compressed.f4.zarr', (err, get) => {
      get([0], (err, array) => {
        t.deepEqual(array.data, new Float32Array([-1000.5, 0, 1000.5, 0]))
        t.end()
      })
    })
  })

  test('1d.contiguous.compressed.sharded.f4' + `.${mode}`, function (t) {
    zarr.open(
      prefix + '1d.contiguous.compressed.sharded.f4.zarr',
      (err, get) => {
        get([0], (err, array) => {
          t.deepEqual(array.data, new Float32Array([-1000.5, 0, 1000.5, 0]))
          t.end()
        })
      }
    )
  })

  test('1d.contiguous.compressed.f8' + `.${mode}`, function (t) {
    zarr.open(prefix + '1d.contiguous.compressed.f8.zarr', (err, get) => {
      get([0], (err, array) => {
        t.deepEqual(array.data, new Float32Array([1.5, 2.5, 3.5, 4.5]))
        t.end()
      })
    })
  })

  test('1d.contiguous.compressed.sharded.f8' + `.${mode}`, function (t) {
    zarr.open(
      prefix + '1d.contiguous.compressed.sharded.f8.zarr',
      (err, get) => {
        get([0], (err, array) => {
          t.deepEqual(array.data, new Float32Array([1.5, 2.5, 3.5, 4.5]))
          t.end()
        })
      }
    )
  })

  test('2d.chunked.compressed.i2' + `.${mode}`, function (t) {
    zarr.open(prefix + '2d.chunked.compressed.i2.zarr', (err, get) => {
      t.plan(4)
      get([0, 0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([1]))
      })
      get([0, 1], (err, array) => {
        t.deepEqual(array.data, new Int16Array([2]))
      })
      get([1, 0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([3]))
      })
      get([1, 1], (err, array) => {
        t.deepEqual(array.data, new Int16Array([4]))
      })
    })
  })

  test('2d.chunked.compressed.sharded.i2' + `.${mode}`, function (t) {
    zarr.open(prefix + '2d.chunked.compressed.sharded.i2.zarr', (err, get) => {
      t.plan(16)
      get([0, 0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([1]))
      })
      get([0, 1], (err, array) => {
        t.deepEqual(array.data, new Int16Array([2]))
      })
      get([0, 2], (err, array) => {
        t.deepEqual(array.data, new Int16Array([3]))
      })
      get([0, 3], (err, array) => {
        t.deepEqual(array.data, new Int16Array([4]))
      })
      get([1, 0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([5]))
      })
      get([1, 1], (err, array) => {
        t.deepEqual(array.data, new Int16Array([6]))
      })
      get([1, 2], (err, array) => {
        t.deepEqual(array.data, new Int16Array([7]))
      })
      get([1, 3], (err, array) => {
        t.deepEqual(array.data, new Int16Array([8]))
      })
      get([2, 0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([9]))
      })
      get([2, 1], (err, array) => {
        t.deepEqual(array.data, new Int16Array([10]))
      })
      get([2, 2], (err, array) => {
        t.deepEqual(array.data, new Int16Array([11]))
      })
      get([2, 3], (err, array) => {
        t.deepEqual(array.data, new Int16Array([12]))
      })
      get([3, 0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([13]))
      })
      get([3, 1], (err, array) => {
        t.deepEqual(array.data, new Int16Array([14]))
      })
      get([3, 2], (err, array) => {
        t.deepEqual(array.data, new Int16Array([15]))
      })
      get([3, 3], (err, array) => {
        t.deepEqual(array.data, new Int16Array([16]))
      })
    })
  })

  test('2d.chunked.compressed.sharded.filled.i2' + `.${mode}`, function (t) {
    zarr.open(
      prefix + '2d.chunked.compressed.sharded.filled.i2.zarr',
      (err, get) => {
        t.plan(16)
        get([0, 0], (err, array) => {
          t.deepEqual(array.data, new Int16Array([0]))
        })
        get([0, 1], (err, array) => {
          t.deepEqual(array.data, new Int16Array([1]))
        })
        get([0, 2], (err, array) => {
          t.deepEqual(array.data, new Int16Array([2]))
        })
        get([0, 3], (err, array) => {
          t.deepEqual(array.data, new Int16Array([3]))
        })
        get([1, 0], (err, array) => {
          t.deepEqual(array.data, new Int16Array([4]))
        })
        get([1, 1], (err, array) => {
          t.deepEqual(array.data, new Int16Array([5]))
        })
        get([1, 2], (err, array) => {
          t.deepEqual(array.data, new Int16Array([6]))
        })
        get([1, 3], (err, array) => {
          t.deepEqual(array.data, new Int16Array([7]))
        })
        get([2, 0], (err, array) => {
          t.deepEqual(array.data, new Int16Array([8]))
        })
        get([2, 1], (err, array) => {
          t.deepEqual(array.data, new Int16Array([9]))
        })
        get([2, 2], (err, array) => {
          t.deepEqual(array.data, new Int16Array([10]))
        })
        get([2, 3], (err, array) => {
          t.deepEqual(array.data, new Int16Array([11]))
        })
        get([3, 0], (err, array) => {
          t.deepEqual(array.data, new Int16Array([12]))
        })
        get([3, 1], (err, array) => {
          t.deepEqual(array.data, new Int16Array([13]))
        })
        get([3, 2], (err, array) => {
          t.deepEqual(array.data, new Int16Array([14]))
        })
        get([3, 3], (err, array) => {
          t.deepEqual(array.data, new Int16Array([15]))
        })
      }
    )
  })

  test('3d.chunked.compressed.i2' + `.${mode}`, function (t) {
    zarr.open(prefix + '3d.chunked.compressed.i2.zarr', (err, get) => {
      t.plan(2)
      get([0, 0, 0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([0, 1, 4, 5, 16, 17, 20, 21]))
      })
      get([1, 0, 1], (err, array) => {
        t.deepEqual(
          array.data,
          new Int16Array([34, 35, 38, 39, 50, 51, 54, 55])
        )
      })
    })
  })

  test('3d.chunked.compressed.sharded.i2' + `.${mode}`, function (t) {
    zarr.open(prefix + '3d.chunked.compressed.sharded.i2.zarr', (err, get) => {
      t.plan(6)
      get([0, 0, 0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([0]))
      })
      get([1, 0, 1], (err, array) => {
        t.deepEqual(array.data, new Int16Array([17]))
      })
      get([2, 0, 0], (err, array) => {
        t.deepEqual(array.data, new Int16Array([32]))
      })
      get([1, 1, 1], (err, array) => {
        t.deepEqual(array.data, new Int16Array([21]))
      })
      get([1, 3, 2], (err, array) => {
        t.deepEqual(array.data, new Int16Array([30]))
      })
      get([3, 3, 3], (err, array) => {
        t.deepEqual(array.data, new Int16Array([63]))
      })
    })
  })
}
