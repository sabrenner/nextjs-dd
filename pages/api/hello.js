// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  // sleep for 5 seconds
  await new Promise(resolve => setTimeout(() => {
    res.json({ hello: 'world'})
    res.status(200).end()
    resolve()
  }, 5000))
}
