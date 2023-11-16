'use strict'

const { PORT = 3001 } = process.env

const tracer = require('dd-trace')
tracer.init({ service: 'nextjs-dd-standard', env: 'test' })
console.log(tracer)
tracer.use('express')
tracer.use('next', {
  hooks: {
    request: (span, req, res) => {
      console.log(req.url);
      console.log('sending')
    }
  }
})

const express = require('express')
const { createServer } = require('http')
const { parse } = require('url')

const cookieParser = require('cookie-parser')
const timeout = require('connect-timeout')

const next = require('next')

const nextApp = next({ dir: __dirname, dev: true, hostname: 'localhost' })
const handle = nextApp.getRequestHandler()



  const app = express();
  app.use(timeout(`1s`));


  const server = createServer(app)

  nextApp.prepare().then(() => {
    console.log('next app ready')

  app.get('*', (req, res) => {

    const url = parse(req.url, true)
    console.log(req.url)
    return handle(req, res, url)
  })
    
})

  server.listen(PORT, () => {
    console.log('listening on ', PORT)
  })

