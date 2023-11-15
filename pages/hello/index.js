export async function getServerSideProps () {
  try {
    await fetch('http://localhost:3000/api/hello')
  } catch (e) {
    console.log(e)
  }
  return {
    props: {}
  }
}

export default function Hello () {
  return (
    <div>
      <h1>Hi!</h1>
    </div>
  )
}