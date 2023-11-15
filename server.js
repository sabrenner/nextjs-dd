'use strict'

const { PORT = 3000 } = process.env

const express = require('express')
const { createServer } = require('http')
const { parse } = require('url')

const cookieParser = require('cookie-parser')
const timeout = require('connect-timeout')

const next = require('next')

const app = next({ dir: __dirname, dev: false, quiet: true, port: PORT, hostname: 'localhost' })
const handle = app.getRequestHandler()

function haltOnTimeout (req, res, next) {
  if (!req.timedout) next()
}

app.prepare().then(() => {

  // approach with express

  // const server = express()
  // server.use(function(req, res, next) {
  //   // req.setTimeout(1, function () {
  //   //   console.log('request timeout')
  //   //   req.destroy()
  //   // })
  //   const delay_ms = 1
  //   setTimeout(() => {
  //     console.log(`we're timing out req`, req.url)
  //     req.destroy()
  //   }, delay_ms)
  //   next()
  // })

  // // server.use(timeout('1ms'))
  // // server.use(haltOnTimeout)
  // // server.use(cookieParser())
  // // server.use(haltOnTimeout)

  // server.get('*', (req, res) => {
  //   const parsedUrl = parse(req.url, true)
  //   return handle(req, res, parsedUrl)
  // })

  // server.listen(3000, (err) => {
  //   if (err) throw err
  //   console.log('Listening on port 3000')
  // })

  const server = createServer((req, res) => {

    setTimeout(() => {
      // simulate timeout middleware
      console.log('destroying req')
      // try different things?
      // req.emit('error')
      throw new Error('something is wrong but from http server')
      // req.destroy()
      // req.emit('close')
      // res.end()
    }, 5_000)

    const parsedUrl = parse(req.url, true)

    if (parsedUrl.path === '/exit') {
      server.close()
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(PORT, 'localhost', () => {
    console.log(server.address()) // eslint-disable-line no-console
  })
})
