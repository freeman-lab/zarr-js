"""
generate test data for zarr-js
"""

import zarr 
from numpy import arange
from numcodecs import Zlib, GZip, Blosc

codecs = [Zlib, GZip, Blosc]

# 1d.contiguous.compressed.i2
for codec in codecs:
    store = zarr.DirectoryStore(f'data/1d.contiguous.{codec.codec_id}.i2.zarr')
    z = zarr.array([1, 2, 3, 4], dtype='i2', store=store, chunks=(4,), compressor=codec())

# 1d.contiguous.uncompressed.i2
store = zarr.DirectoryStore('data/1d.contiguous.uncompressed.i2.zarr')
z = zarr.array([1, 2, 3, 4], dtype='i2', store=store, chunks=(4,), compressor=None)

# 1d.contiguous.compressed.i4
for codec in codecs:
    store = zarr.DirectoryStore(f'data/1d.contiguous.{codec.codec_id}.i4.zarr')
    z = zarr.array([1, 2, 3, 4], dtype='i4', store=store, chunks=(4,), compressor=codec())

# 1d.contiguous.compressed.u1
for codec in codecs:
    store = zarr.DirectoryStore(f'data/1d.contiguous.{codec.codec_id}.u1.zarr')
    z = zarr.array([255, 0, 255, 0], dtype='u1', store=store, chunks=(4,), compressor=codec())

# 1d.contiguous.compressed.<f4
for codec in codecs:
    store = zarr.DirectoryStore(f'data/1d.contiguous.{codec.codec_id}.f4.zarr')
    z = zarr.array([-1000.5, 0, 1000.5, 0], dtype='f4', store=store, chunks=(4,), compressor=codec())

# 1d.contiguous.uncompressed.i4
store = zarr.DirectoryStore('data/1d.contiguous.uncompressed.i4.zarr')
z = zarr.array([1, 2, 3, 4], dtype='i4', store=store, chunks=(4,), compressor=None)

# 1d.contiguous.compressed.f8
for codec in codecs:
    store = zarr.DirectoryStore(f'data/1d.contiguous.{codec.codec_id}.f8.zarr')
    z = zarr.array([1.5, 2.5, 3.5, 4.5], dtype='f8', store=store, chunks=(4,), compressor=codec())

# 1d.contiguous.uncompressed.f8
store = zarr.DirectoryStore('data/1d.contiguous.uncompressed.f8.zarr')
z = zarr.array([1.5, 2.5, 3.5, 4.5], dtype='f8', store=store, chunks=(4,), compressor=None)

# 1d.chunked.compressed.i2
for codec in codecs:
    store = zarr.DirectoryStore(f'data/1d.chunked.{codec.codec_id}.i2.zarr')
    z = zarr.array([1, 2, 3, 4], dtype='i2', store=store, chunks=(2,), compressor=codec())

# 1d.chunked.ragged.compressed.i2
for codec in codecs:
    store = zarr.DirectoryStore(f'data/1d.chunked.ragged.{codec.codec_id}.i2.zarr')
    z = zarr.array([1, 2, 3, 4, 5], dtype='i2', store=store, chunks=(2,), compressor=codec())

# 2d.contiguous.compressed.i2
for codec in codecs:
    store = zarr.DirectoryStore(f'data/2d.contiguous.{codec.codec_id}.i2.zarr')
    z = zarr.array([[1, 2],[3, 4]], dtype='i2', store=store, chunks=(2,2), compressor=codec())

# 2d.chunked.compressed.i2
for codec in codecs:
    store = zarr.DirectoryStore(f'data/2d.chunked.{codec.codec_id}.i2.zarr')
    z = zarr.array([[1, 2],[3, 4]], dtype='i2', store=store, chunks=(1,1), compressor=codec())

# 2d.chunked.ragged.compressed.i2
for codec in codecs:
    store = zarr.DirectoryStore(f'data/2d.chunked.ragged.{codec.codec_id}.i2.zarr')
    z = zarr.array([[1, 2, 3],[4, 5, 6], [7, 8, 9]], dtype='i2', store=store, chunks=(2,2), compressor=codec())

# 3d.contiguous.compressed
for codec in codecs:
    store = zarr.DirectoryStore(f'data/3d.contiguous.{codec.codec_id}.i2.zarr')
    z = zarr.array(arange(27).reshape(3,3,3), dtype='i2', store=store, chunks=(3,3,3), compressor=codec())

# 3d.chunked.compressed
for codec in codecs:
    store = zarr.DirectoryStore(f'data/3d.chunked.{codec.codec_id}.i2.zarr')
    z = zarr.array(arange(27).reshape(3,3,3), dtype='i2', store=store, chunks=(1,1,1), compressor=codec())

# 3d.chunked.mixed.compressed
for codec in codecs:
    store = zarr.DirectoryStore(f'data/3d.chunked.mixed.{codec.codec_id}.i2.zarr')
    z = zarr.array(arange(27).reshape(3,3,3), dtype='i2', store=store, chunks=(3,3,1), compressor=codec())
