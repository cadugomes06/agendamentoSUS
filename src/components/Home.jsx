import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='header-container'>
        <div>Logo</div>

        <nav>
          <Link to={'/login'} ><li>Login</li></Link>
          <Link to={'/register'} ><li>Registrar </li></Link>
        
        </nav>
    </div>
  )
}

export default Home