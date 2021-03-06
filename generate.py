"""
generate test data for zarr-js
"""

import zarr 
from numpy import arange
from numcodecs.zlib import Zlib

# 1d.contiguous.compressed.i2
store = zarr.DirectoryStore('data/1d.contiguous.compressed.i2.zarr')
z = zarr.array([1, 2, 3, 4], dtype='i2', store=store, chunks=(4,), compressor=Zlib())

# 1d.contiguous.uncompressed.i2
store = zarr.DirectoryStore('data/1d.contiguous.uncompressed.i2.zarr')
z = zarr.array([1, 2, 3, 4], dtype='i2', store=store, chunks=(4,), compressor=None)

# 1d.contiguous.compressed.i4
store = zarr.DirectoryStore('data/1d.contiguous.compressed.i4.zarr')
z = zarr.array([1, 2, 3, 4], dtype='i4', store=store, chunks=(4,), compressor=Zlib())

# 1d.contiguous.compressed.u1
store = zarr.DirectoryStore('data/1d.contiguous.compressed.u1.zarr')
z = zarr.array([255, 0, 255, 0], dtype='u1', store=store, chunks=(4,), compressor=Zlib())

# 1d.contiguous.compressed.<f4
store = zarr.DirectoryStore('data/1d.contiguous.compressed.f4.zarr')
z = zarr.array([-1000.5, 0, 1000.5, 0], dtype='f4', store=store, chunks=(4,), compressor=Zlib())

# 1d.contiguous.uncompressed.i4
store = zarr.DirectoryStore('data/1d.contiguous.uncompressed.i4.zarr')
z = zarr.array([1, 2, 3, 4], dtype='i4', store=store, chunks=(4,), compressor=None)

# 1d.contiguous.compressed.f8
store = zarr.DirectoryStore('data/1d.contiguous.compressed.f8.zarr')
z = zarr.array([1.5, 2.5, 3.5, 4.5], dtype='f8', store=store, chunks=(4,), compressor=Zlib())

# 1d.contiguous.uncompressed.f8
store = zarr.DirectoryStore('data/1d.contiguous.uncompressed.f8.zarr')
z = zarr.array([1.5, 2.5, 3.5, 4.5], dtype='f8', store=store, chunks=(4,), compressor=None)

# 1d.chunked.compressed.i2
store = zarr.DirectoryStore('data/1d.chunked.compressed.i2.zarr')
z = zarr.array([1, 2, 3, 4], dtype='i2', store=store, chunks=(2,), compressor=Zlib())

# 1d.chunked.ragged.compressed.i2
store = zarr.DirectoryStore('data/1d.chunked.ragged.compressed.i2.zarr')
z = zarr.array([1, 2, 3, 4, 5], dtype='i2', store=store, chunks=(2,), compressor=Zlib())

# 2d.contiguous.compressed.i2
store = zarr.DirectoryStore('data/2d.contiguous.compressed.i2.zarr')
z = zarr.array([[1, 2],[3, 4]], dtype='i2', store=store, chunks=(2,2), compressor=Zlib())

# 2d.chunked.compressed.i2
store = zarr.DirectoryStore('data/2d.chunked.compressed.i2.zarr')
z = zarr.array([[1, 2],[3, 4]], dtype='i2', store=store, chunks=(1,1), compressor=Zlib())

# 2d.chunked.ragged.compressed.i2
store = zarr.DirectoryStore('data/2d.chunked.ragged.compressed.i2.zarr')
z = zarr.array([[1, 2, 3],[4, 5, 6], [7, 8, 9]], dtype='i2', store=store, chunks=(2,2), compressor=Zlib())

# 3d.contiguous.compressed
store = zarr.DirectoryStore('data/3d.contiguous.compressed.i2.zarr')
z = zarr.array(arange(27).reshape(3,3,3), dtype='i2', store=store, chunks=(3,3,3), compressor=Zlib())

# 3d.chunked.compressed
store = zarr.DirectoryStore('data/3d.chunked.compressed.i2.zarr')
z = zarr.array(arange(27).reshape(3,3,3), dtype='i2', store=store, chunks=(1,1,1), compressor=Zlib())

# 3d.chunked.mixed.compressed
store = zarr.DirectoryStore('data/3d.chunked.mixed.compressed.i2.zarr')
z = zarr.array(arange(27).reshape(3,3,3), dtype='i2', store=store, chunks=(3,3,1), compressor=Zlib())
