import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../../css/Login.css'
import { getTokenWithExpiry, setLocalstorage } from '../../utils/auth'
import { useCart } from './user/CartContext'

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "", role: "user" })
  const { fetchuser } = useCart()
  let navigate = useNavigate()
  const token = getTokenWithExpiry('token')
  const role = getTokenWithExpiry('role')

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/login", {
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
      setLocalstorage('token', json.authtoken, 100000000)
      setLocalstorage('role', json.role, 100000000);

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

  useEffect(() => {
    
      fetchuser()
    
  }, [])
  return (
    <div style={{ backgroundColor: '#eaeef4', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        <div className="mx-auto p-4 shadow rounded " style={{ maxWidth: '45%', backgroundColor: '#f5f7fa' }}>

          <div className="d-flex justify-content-around mb-3">
            <button
              onClick={() => setCredentials({ ...credentials, role: 'user' })}
              className={`btn ${credentials.role === "user" ? "btn-primary" : "btn-outline-primary"}`}
            >
              User
            </button>
            <button
              onClick={() => setCredentials({ ...credentials, role: 'admin' })}
              className={`btn ${credentials.role === "admin" ? "btn-primary" : "btn-outline-primary"}`}
            >
              Admin
            </button>
          </div>

          <hr />

          <form onSubmit={handleSubmit}>
            <div className="mb-3">

              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                className="form-control login-control"
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
                className="form-control login-control"

                placeholder="Password"
                required
              />
              <Link to='/passwordrecovery' className='mx-2 mt-2'>Forget Password ?</Link>
            </div>

            <button type="submit" className="btn btn-success w-100 mb-2">
              Login
            </button>

            <div className="text-center">
              <strong>New User? </strong>
              <Link to="/signup">Create an account</Link>
            </div>
          </form>


        </div>
      </div>
    </div>
  )
}

export default Login
