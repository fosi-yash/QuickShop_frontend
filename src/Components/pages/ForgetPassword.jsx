import React, { useEffect, useState } from 'react';
import { Link,  useNavigate } from 'react-router-dom';
import '../../css/ForgetPassword.css'
import { getTokenWithExpiry } from '../../utils/auth';
import Spinner from '../../assets/images/Spinner.gif'

const ForgetPassword = () => {
  const [field, setField] = useState({
    email: '',
    otp: ''
  });
  const [newPass, setNewPass] = useState({
    password: '',
    confirmPassword: ''
  })
  const [compare, setCompare] = useState("")
  const [hide, setHide] = useState('d-none')
  const [loader, setLoader] = useState(false)
  const navigate=useNavigate()

  const [hideForget, setHideForget] = useState({
    forget: "",
    reset: ''
  })
  const token=getTokenWithExpiry("token")

  const handleChange = (e) => {
    setField({
      ...field, [e.target.name]: e.target.value
    })
  }
  const OTP = async () => {
    setLoader(true)
    if (field.email) {
      const response = await fetch('/api/sent-otp', {
        method: "POST",
        headers: {
          "Content-Type": 'application/json',

        },
        body: JSON.stringify({
          email: field.email
        })
      })
      const data = await response.json()
      if (data.error) {
        setLoader(false)
        return alert(data.error)
      }
      alert(data)
      setHide("")
    }
    setLoader(false)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/verify-otp', {
        method: "POST",
        headers: {
          "Content-Type": 'application/json',

        },
        body: JSON.stringify({
          email: field.email,
          otp: field.otp
        })
      })
      const data = await response.json()
      if (data.error) {
        return alert(data.error)
      }
      setHideForget({
        forget: 'd-none',
        reset: ""
      })


    } catch (err) {
      console.log(err)
    }


  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setNewPass({
      ...newPass,
      [name]: value
    })
  }

  const onSubmit = async(e) => {
    e.preventDefault()
    console.log(newPass.password)
    console.log(newPass.confirmPassword)
    if (newPass.confirmPassword !== newPass.password) {
      return setCompare("Password Doesn't Match")
    }
    if (newPass.confirmPassword === newPass.password) {
      setCompare("")
    }
    try {
      
      const response=await fetch('/api/reset-password',{
        method:'PUT',
        headers:{
          "Content-Type":"application/json",
        
        },
        body:JSON.stringify({password:newPass.password,email:field.email})
      })
      const data= await response.json()
      console.log(data)
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className={` ${hideForget.forget} forget-password-container d-flex align-items-top justify-content-center `}>
        <div className="card shadow-lg p-4 forget-form-card form-card">
          <h2 className="text-center forget-h2 mb-4">Forgot Password</h2>

          {/* {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>} */}

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
              {loader === true &&
                <img className='send-otp-loader'
                  src={Spinner} alt="" />
              }

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
            <button type="submit" disabled={field.otp ? false : true} className="btn btn-primary w-100">Verify</button>
          </form>

          <div className="text-center mt-3">
            <Link to="/login" className="text-decoration-none">Back to Login</Link>
          </div>
        </div>
      </div>

      <div className={` ${hideForget.reset} forget-password-container d-flex align-items-top justify-content-center `}>
        <div className="card shadow-lg p-4 forget-form-card form-card">
          <h2 className="text-center forget-h2 mb-4">Reset Password</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-3 ">

              <input
                type="text"
                name='password'
                className="mb-3 form-control"
                id="password"
                placeholder="New Password"
                value={newPass.password}
                onChange={onChange}
                required
              />
              <div className="d-flex">

                <input
                  type="text"
                  name='confirmPassword'
                  className='form-control'
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  value={newPass.confirmPassword}
                  onChange={onChange}
                  required
                />{compare && <p className='text-danger '>*</p>}
              </div>
              {compare && <p className='text-danger w-100 '>{compare}</p>}
            </div>
            <button type="submit" className="btn btn-primary w-100">Submit</button>
          </form>

          <div className="text-center mt-3">
            <Link to="/login" className="text-decoration-none">Back to Login</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
