var assert = require('assert')

module.exports = cors

function cors (opts) {
  opts = opts || {}
  assert.equal(typeof opts, 'object', 'merry.middleware.cors: opts should be type object')

  var headers = opts.headers || ['Content-Type', 'Accept', 'X-Requested-With']
  var methods = opts.methods || ['PUT', 'POST', 'DELETE', 'GET', 'OPTIONS']
  var credentials = opts.credentials || true
  var origin = opts.origin || '*'

  assert.ok(typeof headers === 'string' || typeof headers === 'object', 'merry.middleware.cors: cors headers should be type string or type object')
  assert.ok(typeof methods === 'string' || typeof methods === 'object', 'merry.middleware.cors: cors methods should be type string or type object')
  assert.equal(typeof credentials, 'boolean', 'merry.middleware.cors: cors credentials should be type boolean')
  assert.equal(typeof origin, 'string', 'merry.middleware.cors: cors origin should be type string')

  if (Array.isArray(headers)) {
    headers = headers.join(', ')
  }
  if (Array.isArray(methods)) {
    methods = methods.join(', ')
  }

  return function (req, res, ctx) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Headers', headers)
    res.setHeader('Access-Control-Allow-Credentials', credentials)
    res.setHeader('Access-Control-Allow-Methods', methods)
  }
}
