import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setLocalstorage } from '../../utils/auth'

const Signup = () => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", confirmpassword: "" })
  let navigate = useNavigate()
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password, confirmpassword: credentials.confirmpassword })
    });
    const json = await response.json()
    console.log(json);
    if (json.success) {
          setLocalstorage('token', json.authtoken, 100000000)
      setLocalstorage('role', json.role, 100000000);// save token
      navigate("/login"); // go to product directly
    }

    else {
      alert("Invalid credentials");
    }
  }
  return (
    <div className="signup-form container mt-5">
      <h2 className="text-center mb-4">Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={credentials.name}
            onChange={onChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={onChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={onChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            type="password"
            id="confirmpassword"
            name="confirmpassword"
            value={credentials.confirmpassword}
            onChange={onChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Submit</button>
        <strong>Already have an Account? </strong><Link to='/login'>Login</Link>
      </form>
    </div>

  );
}

export default Signup
