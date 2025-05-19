import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getTokenWithExpiry } from '../../../utils/auth';

const PaymentCancel = () => {
  const navigate=useNavigate()
  const token = getTokenWithExpiry('token');
  const role = getTokenWithExpiry('role')
  useEffect(()=>{

    if (role !== 'user' || !token) {
      return navigate('/login')
    }
  })
  return (
    <div>
      <div className="text-center mt-5">
        <h2 className="text-danger">Payment Cancelled</h2>
        <p>Your transaction was cancelled. No charges were made.</p>
        <Link to="/product" style={{ cursor: 'pointer' }}>
          Click here
        </Link> to go store
      </div>
    </div>
  )
}

export default PaymentCancel
