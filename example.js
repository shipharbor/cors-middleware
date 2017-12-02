var corsMiddleware = require('./')
var merry = require('merry')

var cors = corsMiddleware({
  methods: 'POST, GET'
})

var app = merry()

app.use(cors)

app.router('GET', '/', function (req, res, ctx) {
  console.log(res.getHeader('access-control-allow-methods')) // 'POST, GET'
  ctx.send(200, { message: 'whoa headers are set' })
})

app.listen(8000)
