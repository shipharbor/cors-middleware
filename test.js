var getPort = require('get-server-port')
var corsMiddleware = require('./')
var devnull = require('dev-null')
var request = require('request')
var merry = require('merry')
var http = require('http')
var tape = require('tape')

tape('glossycors', function (t) {
  t.test('should set default cors headers on a handler', function (t) {
    t.plan(5)
    var cors = corsMiddleware()
    var app = merry({ logStream: devnull() })

    app.use(cors)
    app.route('GET', '/', myEndpoint)
    app.route('PUT', '/', myEndpoint)

    function myEndpoint (req, res, ctx) {
      t.equal(res.getHeader('access-control-allow-origin'), '*', 'cors allow origin in *')
      t.equal(res.getHeader('access-control-allow-headers'), 'Content-Type, Accept, X-Requested-With', 'cors content type is ok')
      t.equal(res.getHeader('access-control-allow-credentials'), true, 'cors credentials are commin through')
      t.equal(res.getHeader('access-control-allow-methods'), 'PUT, POST, DELETE, GET, OPTIONS', 'cors methods are ok')
      ctx.send(200, {})
    }

    var server = http.createServer(app.start())
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
    var cors = corsMiddleware({
      methods: 'GET'
    })

    var app = merry({ logStream: devnull() })

    app.use(cors)
    app.route('GET', '/', myEndpoint)

    function myEndpoint (req, res, ctx) {
      t.equal(res.getHeader('access-control-allow-methods'), 'GET', 'cors sets get method')
      ctx.send(200, {})
    }

    var server = http.createServer(app.start())
    performGet(server, t)
  })

  t.test('should accept multiple cors methods on a handler', function (t) {
    t.plan(3)
    var cors = corsMiddleware({
      methods: 'GET, PUT'
    })
    var app = merry({ logStream: devnull() })

    app.use(cors)
    app.route('GET', '/', myEndpoint)

    function myEndpoint (req, res, ctx) {
      t.equal(res.getHeader('access-control-allow-methods'), 'GET, PUT', 'cors sets get and put methods')
      ctx.send(200, {})
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
