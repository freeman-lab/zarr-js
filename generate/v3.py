import zarrita
from numpy import array, arange

path = "a"

# 1d.contiguous.compressed.i2
store = zarrita.LocalStore("data/v3/1d.contiguous.compressed.i2.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="int16",
    chunk_shape=(4,),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = array([1, 2, 3, 4], dtype="i2")

# 1d.contiguous.uncompressed.i2
store = zarrita.LocalStore("data/v3/1d.contiguous.uncompressed.i2.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="int16",
    chunk_shape=(4,),
)
a[:] = array([1, 2, 3, 4], dtype="i2")

# 1d.contiguous.compressed.i4
store = zarrita.LocalStore("data/v3/1d.contiguous.compressed.i4.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="int32",
    chunk_shape=(4,),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = array([1, 2, 3, 4], dtype="i4")

# 1d.contiguous.compressed.u1
store = zarrita.LocalStore("data/v3/1d.contiguous.compressed.u1.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="uint8",
    chunk_shape=(4,),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = array([255, 0, 255, 0], dtype="u1")


# 1d.contiguous.compressed.<f4
store = zarrita.LocalStore("data/v3/1d.contiguous.compressed.f4.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="float32",
    chunk_shape=(4,),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = array([-1000.5, 0, 1000.5, 0], dtype="f4")

# 1d.contiguous.uncompressed.i4
store = zarrita.LocalStore("data/v3/1d.contiguous.uncompressed.i4.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="int32",
    chunk_shape=(4,),
)
a[:] = array([1, 2, 3, 4], dtype="i4")

# 1d.contiguous.compressed.f8
store = zarrita.LocalStore("data/v3/1d.contiguous.compressed.f8.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="float64",
    chunk_shape=(4,),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = array([1.5, 2.5, 3.5, 4.5], dtype="f8")

# 1d.contiguous.uncompressed.f8
store = zarrita.LocalStore("data/v3/1d.contiguous.uncompressed.f8.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="float64",
    chunk_shape=(4,),
)
a[:] = array([1.5, 2.5, 3.5, 4.5], dtype="f8")

# 1d.chunked.compressed.i2
store = zarrita.LocalStore("data/v3/1d.chunked.compressed.i2.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="int16",
    chunk_shape=(2,),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = array([1, 2, 3, 4], dtype="i2")

# 1d.chunked.filled.compressed.i2
store = zarrita.LocalStore("data/v3/1d.chunked.filled.compressed.i2.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="int16",
    chunk_shape=(2,),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = array([1, 2, 0, 0], dtype="i2")

# 1d.chunked.ragged.compressed.i2
store = zarrita.LocalStore("data/v3/1d.chunked.ragged.compressed.i2.zarr")
a = zarrita.Array.create(
    store,
    shape=(5,),
    dtype="int16",
    chunk_shape=(2,),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = array([1, 2, 3, 4, 5], dtype="i2")

# 2d.contiguous.compressed.i2
store = zarrita.LocalStore("data/v3/2d.contiguous.compressed.i2.zarr")
a = zarrita.Array.create(
    store,
    shape=(2, 2),
    dtype="int16",
    chunk_shape=(2, 2),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = arange(4, dtype="i2").reshape(2, 2)

# 2d.chunked.compressed.i2
store = zarrita.LocalStore("data/v3/2d.chunked.compressed.i2.zarr")
a = zarrita.Array.create(
    store,
    shape=(2, 2),
    dtype="int16",
    chunk_shape=(1, 1),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = arange(4, dtype="i2").reshape(2, 2)

# 2d.chunked.ragged.compressed.i2
store = zarrita.LocalStore("data/v3/2d.chunked.ragged.compressed.i2.zarr")
a = zarrita.Array.create(
    store,
    shape=(3, 3),
    dtype="int16",
    chunk_shape=(2, 2),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = arange(9, dtype="i2").reshape(3, 3)


# 3d.contiguous.compressed
store = zarrita.LocalStore("data/v3/3d.contiguous.compressed.i2.zarr")
a = zarrita.Array.create(
    store,
    shape=(3, 3, 3),
    dtype="int16",
    chunk_shape=(3, 3, 3),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = arange(27, dtype="i2").reshape(3, 3, 3)

# 3d.chunked.compressed
store = zarrita.LocalStore("data/v3/3d.chunked.compressed.i2.zarr")
a = zarrita.Array.create(
    store,
    shape=(3, 3, 3),
    dtype="int16",
    chunk_shape=(1, 1, 1),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = arange(27, dtype="i2").reshape(3, 3, 3)

# 3d.chunked.mixed.compressed
store = zarrita.LocalStore("data/v3/3d.chunked.mixed.compressed.i2.zarr")
a = zarrita.Array.create(
    store,
    shape=(3, 3, 3),
    dtype="int16",
    chunk_shape=(3, 3, 1),
    codecs=[zarrita.codecs.gzip_codec()],
)
a[:] = arange(27, dtype="i2").reshape(3, 3, 3)

#####

# 1d.contiguous.compressed.i2.shards
store = zarrita.LocalStore("data/v3/1d.contiguous.compressed.i2.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="int16",
    chunk_shape=(4,),
    codecs=[
        zarrita.codecs.sharding_codec(
            (2,),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = array([1, 2, 3, 4], dtype="i2")

# 1d.contiguous.compressed.i4.shards
store = zarrita.LocalStore("data/v3/1d.contiguous.compressed.i4.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="int32",
    chunk_shape=(4,),
    codecs=[
        zarrita.codecs.sharding_codec(
            (2,),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = array([1, 2, 3, 4], dtype="i4")

# 1d.contiguous.compressed.u1.shards
store = zarrita.LocalStore("data/v3/1d.contiguous.compressed.u1.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="uint8",
    chunk_shape=(4,),
    codecs=[
        zarrita.codecs.sharding_codec(
            (2,),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = array([255, 0, 255, 0], dtype="u1")


# 1d.contiguous.compressed.<f4.shards
store = zarrita.LocalStore("data/v3/1d.contiguous.compressed.f4.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="float32",
    chunk_shape=(4,),
    codecs=[
        zarrita.codecs.sharding_codec(
            (2,),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = array([-1000.5, 0, 1000.5, 0], dtype="f4")

# 1d.contiguous.compressed.f8.shards
store = zarrita.LocalStore("data/v3/1d.contiguous.compressed.f8.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="float64",
    chunk_shape=(4,),
    codecs=[
        zarrita.codecs.sharding_codec(
            (2,),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = array([1.5, 2.5, 3.5, 4.5], dtype="f8")

# 1d.chunked.compressed.i2.shards
store = zarrita.LocalStore("data/v3/1d.chunked.compressed.i2.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="int16",
    chunk_shape=(2,),
    codecs=[
        zarrita.codecs.sharding_codec(
            (1,),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = array([1, 2, 3, 4], dtype="i2")

# 1d.chunked.filled.compressed.i2.shards
store = zarrita.LocalStore("data/v3/1d.chunked.filled.compressed.i2.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(4,),
    dtype="int16",
    chunk_shape=(2,),
    codecs=[
        zarrita.codecs.sharding_codec(
            (1,),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = array([1, 2, 0, 0], dtype="i2")

# 2d.contiguous.compressed.i2.shards
store = zarrita.LocalStore("data/v3/2d.contiguous.compressed.i2.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(2, 2),
    dtype="int16",
    chunk_shape=(2, 2),
    codecs=[
        zarrita.codecs.sharding_codec(
            (1, 1),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = arange(4, dtype="i2").reshape(2, 2)

# 2d.chunked.compressed.i2.shards
store = zarrita.LocalStore("data/v3/2d.chunked.compressed.i2.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(4, 4),
    dtype="int16",
    chunk_shape=(2, 2),
    codecs=[
        zarrita.codecs.sharding_codec(
            (1, 1),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = arange(16, dtype="i2").reshape(4, 4)

# 2d.chunked.ragged.compressed.i2.shards
store = zarrita.LocalStore("data/v3/2d.chunked.ragged.compressed.i2.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(3, 3),
    dtype="int16",
    chunk_shape=(2, 2),
    codecs=[
        zarrita.codecs.sharding_codec(
            (1, 1),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = arange(9, dtype="i2").reshape(3, 3)


# 3d.contiguous.compressed.i2.shards
store = zarrita.LocalStore("data/v3/3d.contiguous.compressed.i2.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(3, 3, 3),
    dtype="int16",
    chunk_shape=(3, 3, 3),
    codecs=[
        zarrita.codecs.sharding_codec(
            (1, 1, 1),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = arange(27, dtype="i2").reshape(3, 3, 3)

# 3d.chunked.compressed.i4.shards
store = zarrita.LocalStore("data/v3/3d.chunked.compressed.i4.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(8, 8, 2),
    dtype="int16",
    chunk_shape=(4, 4, 2),
    codecs=[
        zarrita.codecs.sharding_codec(
            (2, 2, 1),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = arange(128, dtype="i4").reshape(8, 8, 2)

# 3d.chunked.mixed.compressed.i4.shards
store = zarrita.LocalStore("data/v3/3d.chunked.mixed.compressed.i4.shards.zarr")
a = zarrita.Array.create(
    store,
    shape=(8, 8, 2),
    dtype="int16",
    chunk_shape=(4, 4, 2),
    codecs=[
        zarrita.codecs.sharding_codec(
            (4, 4, 1),
            [
                zarrita.codecs.gzip_codec(),
            ],
        )
    ],
)
a[:] = arange(128, dtype="i4").reshape(8, 8, 2)
