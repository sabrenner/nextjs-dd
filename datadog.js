// const tracer = require('../../../dd-trace-js')
const tracer = require('dd-trace')
tracer.init({ service: 'nextjs-dd-standard', env: 'sam.brenner' })
// console.log(tracer)
tracer.use('next', {
  hooks: {
    request: (span, req, res) => {
    }
  }
})
module.exports = tracer