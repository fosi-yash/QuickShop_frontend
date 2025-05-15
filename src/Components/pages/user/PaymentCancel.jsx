import React from 'react'
import { Link } from 'react-router-dom'

const PaymentCancel = () => {
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
