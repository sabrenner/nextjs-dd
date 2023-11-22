'use strict'

const { PORT = 3001 } = process.env

// const tracer = require('dd-trace')
// tracer.init({ service: 'nextjs-dd-standard', env: 'sam.brenner' })
// console.log(tracer)
// tracer.use('express')
// tracer.use('next', {
//   hooks: {
//     request: (span, req, res) => {
//       console.log(req.url);
//       console.log('sending')
//     }
//   }
// })

const express = require('express')
const { createServer } = require('http')
const { parse } = require('url')

const cookieParser = require('cookie-parser')
const timeout = require('connect-timeout')

const next = require('next')

const nextApp = next({ dir: __dirname, dev: true, hostname: 'localhost' })
const handle = nextApp.getRequestHandler()



const app = express();
app.use(timeout(`2s`));

const server = createServer(app)

nextApp.prepare().then(() => {
  console.log('next app ready')

  app.get('/hello', async (req, res) => {

    const url = parse(req.url, true)
    console.log(req.url)
    try {
      // pretend this throws and we setup an error handler via sentry or other tooling
      await handle(req, res, url)

    } catch (e) {
    }

    await handle(req, res, '_error')



  })
    
})

  server.listen(PORT, () => {
    console.log('listening on ', PORT)
  })

