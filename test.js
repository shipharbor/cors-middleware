var getPort = require('get-server-port')
var corsMiddleware = require('./')
var devnull = require('dev-null')
var request = require('request')
var merry = require('merry')
var http = require('http')
var tape = require('tape')

tape('glossycors', function (t) {
  t.test('should set default cors headers on a handler', function (t) {
    t.plan(11)
    var mw = merry.middleware
    var cors = corsMiddleware()
    var app = merry({ logStream: devnull() })

    app.router([
      '/', {
        put: mw([ cors, myEndpoint ]),
        get: mw([ cors, myEndpoint ])
      }
    ])

    function myEndpoint (req, res, ctx, done) {
      t.equal(res.getHeader('access-control-allow-origin'), '*', 'cors allow origin in *')
      t.equal(res.getHeader('access-control-allow-headers'), 'Content-Type, Accept, X-Requested-With', 'cors content type is ok')
      t.equal(res.getHeader('access-control-allow-credentials'), true, 'cors credentials are commin through')
      t.equal(res.getHeader('access-control-allow-methods'), 'PUT, POST, DELETE, GET, OPTIONS', 'cors methods are ok')
      done()
    }

    var server = http.createServer(app.start())
    performGet(server, t)
    server.listen(function () {
      var port = getPort(server)
      var uri = 'http://localhost:' + port + '/'
      var req = request.put(uri, function (err, req, body) {
        t.ifError(err, 'no err')
        server.close()
      })
      req.end()
    })
  })

  t.test('should accept a single cors method on a handler', function (t) {
    t.plan(3)
    var mw = merry.middleware
    var cors = corsMiddleware({
      methods: 'GET'
    })
    var app = merry({ logStream: devnull() })

    app.router([
      '/', {
        get: mw([ cors, myEndpoint ])
      }
    ])

    function myEndpoint (req, res, ctx, done) {
      t.equal(res.getHeader('access-control-allow-methods'), 'GET', 'cors sets get method')
      done()
    }

    var server = http.createServer(app.start())
    performGet(server, t)
  })

  t.test('should accept multiple cors methods on a handler', function (t) {
    t.plan(3)
    var mw = merry.middleware
    var cors = corsMiddleware({
      methods: 'GET, PUT'
    })
    var app = merry({ logStream: devnull() })

    app.router([
      '/', {
        get: mw([ cors, myEndpoint ])
      }
    ])

    function myEndpoint (req, res, ctx, done) {
      t.equal(res.getHeader('access-control-allow-methods'), 'GET, PUT', 'cors sets get and put methods')
      done()
    }

    var server = http.createServer(app.start())
    performGet(server, t)
  })
})

function performGet (server, t, cb) {
  cb = cb || noop
  server.listen(function () {
    var port = getPort(server)
    var uri = 'http://localhost:' + port + '/'
    request(uri, function (err, req) {
      t.ifError(err, 'no err')
      t.equal(req.statusCode, 200, 'status is ok')
      server.close()
    })
  })
}

function noop () {}
