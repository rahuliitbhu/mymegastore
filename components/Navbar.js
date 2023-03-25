import Link from 'next/link'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import cookie from 'js-cookie'
const NavBar = ()=>{
   const router = useRouter()
   const cookieuser = parseCookies()
   const user =  cookieuser.user ? JSON.toString(cookieuser.user) : ""
 
   function isActive(route){
     if(route== router.pathname){
         return "active"
     }
     else ""
  }

    return(
        <nav>
        <div className="nav-wrapper #880e4f pink darken-4">
          <Link legacyBehavior  href="/"><a className="brand-logo left">MyStore</a></Link >
          <ul id="nav-mobile" className="right">
         
          <li className={isActive('/cart')}><Link legacyBehavior  href="/cart"><a>cart</a></Link ></li>
            {
            (user.role == 'admin' || user.role == 'root') &&
              <li className={isActive('/create')}><Link legacyBehavior  href="/create"><a>create</a></Link ></li>
            }
            
        
            {user ?
            <>
                <li className={isActive('/account')}><Link legacyBehavior  href="/account"><a>Account</a></Link ></li>
                <li><button className="btn red" onClick={()=>{
                  cookie.remove('token')
                  cookie.remove('user')
                  router.push('/login')
                }}>logout</button></li>  
             </>   
            :
            <>
            <li className={isActive('/login')}><Link legacyBehavior  href="/login"><a>login</a></Link ></li>
            <li className={isActive('/signup')}><Link legacyBehavior  href="/signup"><a>signup</a></Link ></li>
            </>
            }
           
           
          </ul>
        </div>
      </nav>
    )
}


export default NavBar