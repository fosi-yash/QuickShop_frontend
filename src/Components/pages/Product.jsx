import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCart } from './user/CartContext'
import Navbar from './Navbar';
import Spinner from './Spinner';

import '../../css/Product.css'

import { getTokenWithExpiry } from '../../utils/auth';


const Product = () => {
    const backend = import.meta.env.BACKEND;
    const navigate = useNavigate()
    const [product, setProduct] = useState([]);
    const [quantity, setQuantity] = useState({ qty: "1" })
    const [cart, setCart] = useState([]);

    const token=getTokenWithExpiry('token')
    if(!token){
        navigate('/login')
    }
    // console.log(getTokenWithExpiry('token'))


    const { cartItems, fetchProducts, items, addtocart } = useCart()

    var loading = false

    useEffect(() => {

        // fetchProducts()

    }, []);
    const onChange = (e) => {
        setQuantity({
            qty: e.target.value
        })
    }

    const onBuy = (e, p) => {
        e.preventDefault();
        const newCart = [...cart, {
            productName: p.productName,
            prize: (parseFloat(p.prize).toFixed(2) / 84.68).toFixed(2),
            quantity: quantity.qty,
            images: p.images

        }];
        setCart(newCart);
        console.log(quantity)
        navigate('/checkout', { state: { cart: newCart } });
    };

    const onCart = (e, p) => {
        const totalAmount = p.prize * quantity.qty
        e.preventDefault()
        addtocart({
            _id: p._id,
            productName: p.productName,
            prize: (parseFloat(p.prize).toFixed(2) / 84.68).toFixed(2),
            images: p.images,
            quantity: quantity.qty,
            totalAmount: totalAmount
        })

    }
    return (
        <div className='product-main-div'>

            {loading && <Spinner />}
            <div className="container  text-center my-3">
                <div className="row">
                    {items.length !== 0 ?
                        
                            items.map((p) => (
                                <div key={p._id} className="col-md-3 mb-4">

                                    <div className=" show-product p-3 border rounded">

                                        <div className='mx-2'>
                                            <img src={`http://localhost:3000${p.images}`} style={{transition:'transform 0.3s ease' }} className='img img-fluid' alt="Mobile Image" />
                                        </div>
                                        <h5 className='show-product-heading'> {p.productName.length > 20
                                            ? p.productName.slice(0, 20) + '...'
                                            : p.productName}</h5>
                                        <p>Price: ${(parseFloat(p.prize).toFixed(2) / 84.68).toFixed(2)}</p>
                                        <label htmlFor="quantity">Qty :&nbsp; </label>
                                        <select name="quantity" id="quantity" onChange={onChange}>
                                            <option value="" disabled>select</option>
                                            {[...Array(10)].map((_, index) => (
                                                <option style={{ textAlign: 'center', width: '50%' }} key={index + 1} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select><br />
                                        <div className='d-flex justify-content-between mt-2'>
                                            <button className="btn buy-product-btn  btn-primary" onClick={(e) => onBuy(e, p)} type="button">Buy Now</button>
                                            <button className="btn cart-btn btn-secondary" onClick={(e) => onCart(e, p)} type="button">Add to Cart</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                         : <div  ><img style={{height:'250px' , width:'300px' , marginTop:'40px'}}   src='empty.jpg' alt="product does not found" /> <p>Not Available</p> </div>}
                </div>
            </div>

        </div>
    )
}

export default Product
