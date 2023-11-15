// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  // sleep for 5 seconds
  await new Promise(resolve => setTimeout(resolve, 5000))
  res.json({ hello: 'world'})
}
