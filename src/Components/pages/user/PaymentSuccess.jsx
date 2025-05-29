import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenWithExpiry } from '../../../utils/auth';


const PaymentSuccess = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fdiv, setFdiv] = useState('');
  const [sdiv, setSdiv] = useState('d-none');

  const navigate = useNavigate();

  const token = getTokenWithExpiry('token');
  const role = getTokenWithExpiry('role')
  useEffect(()=>{

    if (role !== 'user' || !token) {
      return navigate('/login')
    }
  })


  const fetchOrder = async () => {
    try {
      const response = await fetch('http://localhost:3000/lastorder', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchOrder();
    setTimeout(() => {
      if (fdiv === '') {
        setFdiv('d-none')
        setSdiv('')
      }
    }, 4000);
  }, []);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h4>Loading your order...</h4>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container text-center mt-5">
        <h4>Order not found.</h4>
        <button className="btn btn-secondary mt-3" onClick={() => navigate('/product')}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#eaeef4' }}>
      <div className={`container ${fdiv} d-flex flex-column align-items-center vh-100 mt-5 text-center`} >
        <img
          src="/success.gif"
          alt="Payment Successful"
          className="mt-4 img-fluid mb-4"
          style={{ maxWidth: '300px', background:'transparent'}}
        />
        <h2 className="text-success">Payment Successful!</h2>
        <p className="text-muted">Thank you for your purchase.</p>
        <button
          className="btn btn-primary mt-4 opacity-75"
          onClick={() => navigate('/product')}
        >
          Back to Products
        </button>
      </div>

      <div className={`container ${sdiv} mt-3 p-4 border border-success rounded  shadow`} style={{ backgroundColor: 'rgba(234, 238, 244,0.7)' }}>
        <h2 className="text-success mb-3 text-center">🎉 Order Summary</h2>
        <hr />

        <h5>👤 Customer: <span className="text-dark mb-1">{order.username}</span></h5>
        <p><strong>🆔 Order ID:</strong> {order.orderID}</p>
        <p><strong>🆔 Payment ID:</strong> {order.paymentid}</p>
        <p><strong>📅 Date:</strong> {new Date(order.paymentdate).toLocaleDateString()}</p>
        <p><strong>💳 Status:</strong> <span className="text-success">{order.paymentstatus}</span></p>
        <p><strong>💰 Total Paid:</strong> ${parseFloat(order.totalprice).toFixed(2)}</p>

        {order.address && (
          <div className="mt-4">
            <h5>📍 Shipping Details:</h5>
            <p><strong>Name:</strong> {order.address.name}</p>
            <p><strong>Phone:</strong> {order.address.number}</p>
            <p><strong>Address:</strong> {`${order.address.address + ","}  ${order.address.locality && order.address.locality + ","}`} {order.address.city}, {order.address.state} - {order.address.pincode}</p>
            {order.address.landmark && <p><strong>Landmark:</strong> {order.address.landmark}</p>}
          </div>
        )}

        <h5 className="mt-4">🛍️ Ordered Products:</h5>
        <table className="table table-bordered mt-2">
          <thead className="table-success">
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.productname}</td>
                <td>${item.prize}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go to Home</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
