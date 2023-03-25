import Link from 'next/link'

const Product = ()=>{
    return(
      <div>
        <h1>product page</h1>
        <Link legacyBehavior href="/"><a>go to home</a></Link>
      </div>
    )
  }
  
  export default Product