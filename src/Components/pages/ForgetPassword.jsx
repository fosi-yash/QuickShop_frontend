import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/ForgetPassword.css'

const ForgetPassword = () => {
  const [field, setField] = useState({
    email: '',
    otp: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hide,setHide]=useState('d-none')

  const handleChange = (e) => {
    setField({
      ...field, [e.target.name]: e.target.value
    })
  }
  const OTP=()=>{
    setHide("")
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {




      // const res = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email }),
      // });

      // const data = await res.json();
      // if (res.ok) {
      //   setMessage(data.message || 'Password reset link sent.');
      // } else {
      //   setError(data.error || 'Something went wrong.');
      // }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="forget-password-container d-flex align-items-top justify-content-center ">
      <div className="card shadow-lg p-4 forget-form-card form-card">
        <h2 className="text-center forget-h2 mb-4">Forgot Password</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 ">
            <label htmlFor="email" className="form-label">Email address</label>
            <div className="d-flex">
              <input
                type="email"
                name='email'
                className="mb-3 form-control"
                id="email"
                placeholder="you@example.com"
                value={field.email}
                onChange={handleChange}
                required
              />
              <button className='btn send-otp-btn mx-3 border' onClick={OTP}>Send OTP</button>
            </div>

            <input
              type="text"
              name='otp'
              className={`${hide} w-75 form-control`}
              id="otp"
              placeholder="Enter OTP"
              value={field.otp}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-75">Verify</button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
