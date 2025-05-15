import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../css/Login.css'
import { setLocalstorage } from '../../utils/auth'

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "", role: "user" })
  let navigate = useNavigate()
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password, role: credentials.role })
    });
    const json = await response.json()
    console.log(json);
    if (json.error) {
      setCredentials({ ...credentials, email: "", password: "" })
      return alert(json.error)
    }
    if (json.success) {
      // Save the auth token and redirect
      setLocalstorage(token,json.authtoken,100000000)
      setLocalstorage(role, json.role,100000000);
      if (json.role === 'admin') {
        navigate('/dashboard')
      } else {

        navigate("/product");
      }
    }
    else {
      alert("Invalid credentials");
    }
  }
  return (
    <div className=' login' >

      <div className='  container  content '>
        <div className="d-flex container justify-content-around">
          <div className="user"><button onClick={() => { setCredentials({ ...credentials, role: 'user' }) }} className={` ${credentials.role === "user" ? "user-btn" : "border-0"} user_btn `}>User</button></div>
          <div className="admin"><button onClick={() => { setCredentials({ ...credentials, role: 'admin' }) }} className={` ${credentials.role === "admin" ? "user-btn" : "border-0"} user_btn `}>Admin</button></div>
        </div>
        <hr className=' login_role_hr' />
        <div className='login-form'>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 ">
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                className="form-control"
                placeholder="E-mail"
                required
              />
            </div>

            <div className="mb-3">

              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={onChange}
                className="form-control"
                placeholder='Password'
                required
              />
            </div>
            <button type="submit" className="btn login-btn mb-2 w-100">Login</button>
            <div className="text-center">
              <strong>New User ? </strong><Link to='/signup'>Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
