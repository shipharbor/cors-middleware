var corsMiddleware = require('./')
var merry = require('merry')
var http = require('http')

var mw = merry.middleware
var cors = corsMiddleware({
  methods: 'POST, GET'
})

var app = merry()

app.router([
  [ '/', {
    get: mw([ cors, myEndpoint ])
  }]
])

function myEndpoint (req, res, ctx, done) {
  console.log(res.getHeader('access-control-allow-methods')) // 'POST, GET'
  done(null, 'whoa headers are set')
}

var server = http.createServer(app.start())
server.listen(8080)
