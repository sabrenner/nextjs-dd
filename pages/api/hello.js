// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      res.status(200).send('Hello World!')
      resolve()
    }, 10_000);
    req.on('error', () => {
      clearTimeout(timeout)
      reject(new Error('something went wrong from API handler?'))
    })
  })
}
