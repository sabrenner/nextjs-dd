export async function getServerSideProps () {
    await fetch('http://localhost:3001/api/hello')

  return {
    props: {}
  }
}

export default function Hello () {
  throw new Error ('datadooooog')
  return (
    <div>
      <h1>Hi!</h1>
    </div>
  )
}