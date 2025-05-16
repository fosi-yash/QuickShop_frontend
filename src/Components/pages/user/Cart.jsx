import React, { useEffect, useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import { useCart } from './CartContext'


const Cart = () => {
    const { cartItems, emptyCart, removeCart } = useCart()
    const [products, setProducts] = useState([])
    const navigate = useNavigate()


    const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.prize * item.quantity);
    }, 0);
    const checkout = () => {
        navigate('/checkout', { state: { cart: cartItems } });
    }

    const removeClick = (e, product) => {
        // e.preventDefault()
        removeCart(product)

    }
    const removeall = (e) => {
        e.preventDefault()
        emptyCart()
    }

    return (
        <>
            {cartItems.length > 0 ?

                <div style={{ backgroundColor: '#eaeef4', minHeight:'100vh' }}>

                    <div className='container text-end ' style={{}} ><Link onClick={removeall}>Remove All</Link></div>
                    <div className={` container  text-center `}>
                        {cartItems.map((item, index) => (
                            <div className='p-1 shadow-sm rounded' key={index + 1}>

                                <div className="mt-1 d-flex p-1 pt-2" style={{backgroundColor:'#f5f7fa'}}>


                                    <div className='p-2 ' >
                                        <img src={`http://localhost:3000${item.images}`} style={{ height: '200px', width: '220px' }} alt="" />
                                    </div>
                                    <div className=' w-75 mt-3'>

                                        <div className=' text-start ms-3' >
                                            <h5 className='me-5'>{item.productName}</h5>
                                        </div>
                                        <div className='text-start ms-3 ' >
                                            <h5 className='me-5 mt-3'>${item.prize}</h5>
                                        </div>
                                        <div className='text-start ms-3 ' >
                                            <h5 className='me-5 mt-3'>Qty : {item.quantity}</h5>
                                        </div>
                                    </div >
                                    <div className='d-flex pt-2 w-25 mt-3' style={{margin:'auto auto'}} >

                                        <button className='btn h-25 mt-5 ms-2 w-75' style={{backgroundColor:'transparent', color:'red'}} onClick={(e) => { removeClick(e, item._id) }}><i className="fa-duotone fa-solid fa-trash" ></i> Remove</button>

                                        </div>

                                </div>


                            </div>
                        ))}
                    </div>
                
                    <div className="container sticky-button-container pb-2 p-3 d-flex justify-content-end mt-1  rounded" style={{position : 'sticky',
    bottom : '2px',  zIndex : '999',backgroundColor: '#f1f1f1'}}>
                        <button className="btn  me-5" style={{ width: "20%",backgroundColor:'orange' }} onClick={checkout}>
                            Next
                        </button>
                    </div>
                </div>
                : <div className='alert alert-info text-center' role="alert">
                    <h5> Your cart is empty.</h5>
                    <button className='btn btn-success mt-4 opacity-75' onClick={() => navigate('/product')}>Go Back</button>
                </div>}
        </>
    )
}

export default Cart
