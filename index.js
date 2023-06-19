const v2 = require('./src/v2.js')
const v3 = require('./src/v3.js')

const zarr = (request, version) => {
  if (!version || version == 'v2') {
    return v2(request)
  } else if (version == 'v3') {
    return v3(request)
  } else {
    throw Error(`version ${version} not recognized`)
  }
}

module.exports = zarr