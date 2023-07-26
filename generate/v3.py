import zarrita
from numpy import array, arange
import asyncio

store = zarrita.LocalStore("data/v3")

# 1d.contiguous.compressed.i2
data = array([1, 2, 3, 4], dtype="i2")
path = "1d.contiguous.compressed.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data

# 1d.contiguous.uncompressed.i2
data = array([1, 2, 3, 4], dtype="i2")
path = "1d.contiguous.uncompressed.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data

# 1d.contiguous.compressed.i4
data = array([1, 2, 3, 4], dtype="i4")
path = "1d.contiguous.compressed.i4.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data

# 1d.contiguous.compressed.u1
data = array([255, 0, 255, 0], dtype="u1")
path = "1d.contiguous.compressed.u1.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data


# 1d.contiguous.compressed.<f4
data = array([-1000.5, 0, 1000.5, 0], dtype="f4")
path = "1d.contiguous.compressed.f4.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data

# 1d.contiguous.uncompressed.i4
data = array([1, 2, 3, 4], dtype="i4")
path = "1d.contiguous.uncompressed.i4.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
    )
)
a[:] = data


# 1d.contiguous.compressed.f8
data = array([1.5, 2.5, 3.5, 4.5], dtype="f8")
path = "1d.contiguous.compressed.f8.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data

# 1d.contiguous.uncompressed.b1
data = array([True, False, True, False], dtype="b1")
path = "1d.contiguous.uncompressed.b1.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype="bool",
        chunk_shape=(4,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data

# 1d.contiguous.compressed.b1
data = array([True, False, True, False], dtype="b1")
path = "1d.contiguous.compressed.b1.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype="bool",
        chunk_shape=(4,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data

# 1d.contiguous.uncompressed.f8
data = array([1.5, 2.5, 3.5, 4.5], dtype="f8")
path = "1d.contiguous.uncompressed.f8.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data


# 1d.chunked.compressed.i2
data = array([1, 2, 3, 4], dtype="i2")
path = "1d.chunked.compressed.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data

# 1d.chunked.filled.compressed.i2
data = array([1, 2, 0, 0], dtype="i2")
path = "1d.chunked.filled.compressed.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data

# 1d.chunked.ragged.compressed.i2
data = array([1, 2, 3, 4, 5], dtype="i2")
path = "1d.chunked.ragged.compressed.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2,),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:] = data

# 2d.contiguous.compressed.i2
data = arange(1, 5, dtype="i2").reshape(2, 2)
path = "2d.contiguous.compressed.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2, 2),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:, :] = data

# 2d.chunked.compressed.i2
data = arange(1, 5, dtype="i2").reshape(2, 2)
path = "2d.chunked.compressed.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(1, 1),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:, :] = data

# 2d.chunked.ragged.compressed.i2
data = arange(1, 10, dtype="i2").reshape(3, 3)
path = "2d.chunked.ragged.compressed.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2, 2),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:, :] = data

# 3d.contiguous.compressed
data = arange(27, dtype="i2").reshape(3, 3, 3)
path = "3d.contiguous.compressed.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(3, 3, 3),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:, :, :] = data

# 3d.chunked.compressed
data = arange(64, dtype="i2").reshape(4, 4, 4)
path = "3d.chunked.compressed.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2, 2, 2),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:, :, :] = data

# 3d.chunked.mixed.compressed
data = arange(27, dtype="i2").reshape(3, 3, 3)
path = "3d.chunked.mixed.compressed.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(3, 3, 1),
        codecs=[zarrita.codecs.gzip_codec()],
    )
)
a[:, :, :] = data

# 1d.contiguous.compressed.i2.group
data_a = arange(1, 5, dtype="i2")
data_b = arange(5, 9, dtype="i2")
path = "1d.contiguous.compressed.i2.group.zarr"
g = zarrita.Group.create(store / path)
a = g.create_array(
    "a",
    shape=data_a.shape,
    dtype=data_a.dtype,
    chunk_shape=(4,),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = data_a
b = g.create_array(
    "b",
    shape=data_b.shape,
    dtype=data_b.dtype,
    chunk_shape=(4,),
    codecs=[zarrita.codecs.gzip_codec()],
)
b[:] = data_b

#####

# 1d.contiguous.compressed.sharded.i2
data = array([1, 2, 3, 4], dtype="i2")
path = "1d.contiguous.compressed.sharded.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(4,),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:] = data

# 1d.contiguous.compressed.sharded.i4
data = array([1, 2, 3, 4], dtype="i4")
path = "1d.contiguous.compressed.sharded.i4.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(4,),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:] = data

# 1d.contiguous.compressed.sharded.u1
data = array([255, 0, 255, 0], dtype="u1")
path = "1d.contiguous.compressed.sharded.u1.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(4,),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:] = data


# 1d.contiguous.compressed.sharded.<f4
data = array([-1000.5, 0, 1000.5, 0], dtype="f4")
path = "1d.contiguous.compressed.sharded.f4.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(4,),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:] = data

# 1d.contiguous.compressed.sharded.f8
data = array([1.5, 2.5, 3.5, 4.5], dtype="f8")
path = "1d.contiguous.compressed.sharded.f8.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(4,),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(4,),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:] = data


# 1d.contiguous.compressed.sharded.b1
data = array([True, False, True, False], dtype="b1")
path = "1d.contiguous.compressed.sharded.b1.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype="bool",
        chunk_shape=(4,),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(4,),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:] = data

# 1d.chunked.compressed.sharded.i2
data = array([1, 2, 3, 4], dtype="i2")
path = "1d.chunked.compressed.sharded.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2,),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(1,),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:] = data

# 1d.chunked.filled.compressed.sharded.i2
data = array([1, 2, 0, 0], dtype="i2")
path = "1d.chunked.filled.compressed.sharded.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2,),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(1,),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:] = data

# # 1d.chunked.ragged.compressed.sharded.i2 (TypeError: 'int' object is not iterable)
# data = array([1, 2, 3, 4, 5], dtype="i2")
# path = "1d.chunked.ragged.compressed.sharded.i2.zarr"
# a = asyncio.run(
#     zarrita.Array.create_async(
#         store / path,
#         shape=data.shape,
#         dtype=data.dtype,
#         chunk_shape=(2,),
#         codecs=[
#             zarrita.codecs.sharding_codec(
#                 chunk_shape=(1,),
#                 codecs=[
#                     zarrita.codecs.blosc_codec(
#                         typesize=data.dtype.itemsize, cname="gzip"
#                     )
#                 ],
#             )
#         ],
#     )
# )
# a[:] = data

# 2d.contiguous.compressed.sharded.i2
data = arange(1, 5, dtype="i2").reshape(2, 2)
path = "2d.contiguous.compressed.sharded.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2, 2),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(2, 2),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:, :] = data

# 2d.chunked.compressed.sharded.filled.i2
data = arange(16, dtype="i2").reshape(4, 4)
path = "2d.chunked.compressed.sharded.filled.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2, 2),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(1, 1),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:, :] = data

# 2d.chunked.compressed.sharded.i2
data = arange(16, dtype="i2").reshape(4, 4) + 1
path = "2d.chunked.compressed.sharded.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2, 2),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(1, 1),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:, :] = data

# 2d.chunked.ragged.compressed.sharded.i2
data = arange(1, 10, dtype="i2").reshape(3, 3)
path = "2d.chunked.ragged.compressed.sharded.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2, 2),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(1, 1),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:, :] = data


# 3d.contiguous.compressed.sharded.i2
data = arange(27, dtype="i2").reshape(3, 3, 3)
path = "3d.contiguous.compressed.sharded.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(3, 3, 3),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(3, 3, 3),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:, :, :] = data

# 3d.chunked.compressed.sharded.i2
data = arange(64, dtype="i2").reshape(4, 4, 4)
path = "3d.chunked.compressed.sharded.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(2, 2, 2),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(1, 1, 1),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:, :, :] = data

# 3d.chunked.mixed.compressed.sharded.i2
data = arange(27, dtype="i2").reshape(3, 3, 3)
path = "3d.chunked.mixed.compressed.sharded.i2.zarr"
a = asyncio.run(
    zarrita.Array.create_async(
        store / path,
        shape=data.shape,
        dtype=data.dtype,
        chunk_shape=(3, 3, 3),
        codecs=[
            zarrita.codecs.sharding_codec(
                chunk_shape=(3, 3, 1),
                codecs=[
                    zarrita.codecs.gzip_codec()
                ],
            )
        ],
    )
)
a[:, :, :] = data


# 1d.contiguous.compressed.sharded.i2.group
data_a = arange(1, 5, dtype="i2")
data_b = arange(5, 9, dtype="i2")
path = "1d.contiguous.compressed.sharded.i2.group.zarr"
g = zarrita.Group.create(store / path)
a = g.create_array(
    "a",
    shape=data_a.shape,
    dtype=data_a.dtype,
    chunk_shape=(4,),
    codecs=[
        zarrita.codecs.sharding_codec(
            chunk_shape=(4,),
            codecs=[
                zarrita.codecs.gzip_codec()
            ],
        )
    ],
)
a[:] = data_a
b = g.create_array(
    "b",
    shape=data_b.shape,
    dtype=data_b.dtype,
    chunk_shape=(4,),
    codecs=[
        zarrita.codecs.sharding_codec(
            chunk_shape=(4,),
            codecs=[
                zarrita.codecs.gzip_codec()
            ],
        )
    ],
)
b[:] = data_b
