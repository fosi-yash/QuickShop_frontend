import React, { useEffect, useState, useRef } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import Spinner from '../Spinner';
import Address from './Address';
import { shippingContext } from './AddressContext';
import { getTokenWithExpiry } from '../../../utils/auth';



const Paypal = () => {

  const [cart, setCart] = useState([])
  const { cartItems, emptyCart } = useCart()
  const {shipping}=shippingContext()
  const navigate = useNavigate();
  const location = useLocation();
  const Cart = location.state.cart;
  const [paypal, setPaypal] = useState('d-none')
  const [table, setTable] = useState('')
  const [selectedAddress,setSelectedAddress]=useState("")
  var loader = false
  const authtoken = getTokenWithExpiry('token')

  const shippingCharge = shipping


  useEffect(() => {
    loader = true
    setCart(Cart)
    loader = false
  }, [Cart])

  
  const totalAmount = cart.reduce((total, item) => {
    return total + (item.prize * item.quantity);
  }, 0)
  const finalAmount = totalAmount + Number(shipping);


  const CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  const style = {
    layout: 'vertical',
    shape: 'rect',
    color: 'gold',
    label: 'paypal',
    height: 40
  };

  const createOrder = async (data, actions) => {
    loader = true
    try {
      const response = await fetch('http://localhost:3000/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": `${authtoken}`
        },
        body: JSON.stringify({
          products: cart,
          shippingCharge: shippingCharge
        })
      });
      const responseData = await response.json();
      console.log("Created order ID:", responseData.orderID);
      loader = false
      return responseData.orderID;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
    }
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(details => {
      console.log("Payment successful:", details);
      console.log("Payment successful:",details.purchase_units[0].payments.captures[0].id

      );


      (async () => {
        const orederNumber = `#ORD${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const response = await fetch('http://localhost:3000/addorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': `${authtoken}`
          },
          body: JSON.stringify({
            username: `${details.payer.name.given_name} ${details.payer.name.surname}`,
            orderID: orederNumber,
            products: cart.map(item => ({
              productname: item.productName,
              prize: item.prize,
              quantity: item.quantity
            })),
            totalprice: totalAmount,
            paymentid: details.id,
            captureid:details.purchase_units[0].payments.captures[0].id,
            paymentstatus: details.status,
            paymentdate: details.create_time.substring(0, 10),
            address: selectedAddress 
          })
        });
        const json = await response.json();
        console.log(json);
        emptyCart()
        navigate('/success');
      })();

    });
  }

  const onCancel = () => {
    navigate('/cancel');
  };

  const onPay = () => {
    if(selectedAddress===""){
      alert('please select address')
      return
    }
    if (table === '') {
      setPaypal('')
      setTable('d-none ')

      console.log(detailMargin)
    }
  }
 

  return (
    <div style={{ backgroundColor: '#f1f1f1', height:'100vh' }}>
      <div className={` container p-3  `} >

        
        <div className={`container  ${selectedAddress!=="" && table}   text-center `} >

        <Address onselectedaddress={setSelectedAddress}/>
        </div>

        <div className={`shadow sticky-top   bg-white w-50  text-center mt-2 p-4`} style={{ margin:'auto auto', zIndex:'100'}}>

          <h5>Price Details : </h5><hr />
          <div className='d-flex justify-content-between' >
            <p><strong>Price ({cart.length} items) :</strong></p>
            <p>${totalAmount.toFixed(2)}</p>
          </div>
          <div className='d-flex justify-content-between' >
            <p><strong>Delivery Charge :</strong></p>
            <p>${shippingCharge.toFixed(2)}</p>
          </div>
          <hr style={{ border: 'groove' }} />
          <div className='d-flex justify-content-between' >
            <p><strong>Total Amount :</strong></p>
            <p>${finalAmount.toFixed(2)}</p>
          </div>

          <div className={`d-flex p-2 ${table} bg-white justify-content-center `}>
            <button className='btn w-50 ' onClick={onPay} style={{ backgroundColor: 'orange', margin: 'auto 0px' }}>Place Order</button>
          </div>

        </div>


      </div>
      <div className={`${paypal}`} style={{ maxWidth: '400px', margin: '15px auto' }}>
        {loader && <Spinner />}
        <PayPalScriptProvider options={{
          'client-id': CLIENT_ID,
          currency: 'USD'
        }}>
          <PayPalButtons
            style={style}
            createOrder={createOrder}
            onApprove={onApprove}
            onCancel={onCancel}
          />
        </PayPalScriptProvider>
      </div>
    </div>







  );
};

export default Paypal;
