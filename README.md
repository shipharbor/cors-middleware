# cors-middleware
[![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][6]][7] [![js-standard-style][8]][9]

Middleware to set your [Cross Origin Resource Sharing][cr] headers in your http
clients ✌🏽.

## usage 
`cors-middleware` functions as middleware that takes in `req`, `res`, `ctx`,
`done` and sets all applicable headers on the `res` argument. 

```js
var corsMiddleware = require('cors-middleware')
var merry = require('merry')

var mw = merry.middleware
var cors = corsMiddleware({
  methods: 'GET',
  origin: 'http://localhost:8080'
})

var app = merry()
app.use(cors)
app.router('GET', '/', homeRoute)

function homeRoute (req, res, ctx) {
  console.log(res.getHeader('access-control-allow-origin')) // 'http://localhost:8080'
  ctx.send(200, { msg: 'woah cors headers are all set' })
}
```

### cors = corsMiddleware(opts)
You can pass on a few options to the cors wrapper to handle the specific headers 
you might need. If not tho, we gotchu with some defaults.
- __opts.headers__: sets up headers that you want browsers to be able to access.
Takes an array. Defaults to `['Content-Type', 'Accept', 'X-Requested-With']`.
- __opts.methods__: these are methods that are allowed to access your resource.
Also takes in an array. Will default to the usual suspects of
`['PUT', 'POST', 'DELETE', 'GET', 'OPTIONS']`
- __opts.credentials__: this indicates whether or not a request can be made 
using credentials. Will default to true.
- __opts.origin__: this specifies a URI that can access your resource. Takes in 
a string and will default to wildcard, `'*'`

## related content 
- [shipharbor/merry][m]
- [CORS][cr]

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/cors-middleware.svg?style=flat-square
[3]: https://npmjs.org/package/cors-middleware
[4]: https://img.shields.io/travis/shipharbor/cors-middleware/master.svg?style=flat-square
[5]: https://travis-ci.org/shipharbor/cors-middleware
[6]: http://img.shields.io/npm/dm/cors-middleware.svg?style=flat-square
[7]: https://npmjs.org/package/cors-middleware
[8]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[9]: https://github.com/feross/standard
[m]: https://github.com/shipharbor/merry
[cr]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
