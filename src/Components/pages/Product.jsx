import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './user/CartContext';
import Spinner from './Spinner';
import '../../css/Product.css';
import { getTokenWithExpiry } from '../../utils/auth';

const Product = () => {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState({ qty: "1" });
    const [cart, setCart] = useState([]);
    const token = getTokenWithExpiry('token');
    const role = getTokenWithExpiry('role');
    const location = useLocation()
    const API_URL = import.meta.env.VITE_BACKEND_API;
   

    const { items, fetchProducts, addtocart, fetchuser } = useCart();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token || role !== 'user') {
            navigate('/login');
        } else {
            fetchuser()
            if (location.state !== 'from_home') {
                fetchProducts();
            }
        }
    }, []);

    const onChange = (e) => {
        setQuantity({ qty: e.target.value });
    };

    const onBuy = (e, p) => {
        e.preventDefault();
        const newCart = [...cart, {
            productName: p.productName,
            prize: (parseFloat(p.prize).toFixed(2) / 84.68).toFixed(2),
            quantity: quantity.qty,
            images: p.images
        }];
        setCart(newCart);
        navigate('/checkout', { state: { cart: newCart } });
    };

    const onCart = (e, p) => {
        e.preventDefault();
        const totalAmount = p.prize * quantity.qty;
        addtocart({
            _id: p._id,
            productName: p.productName,
            prize: (parseFloat(p.prize).toFixed(2) / 84.68).toFixed(2),
            images: p.images[0],
            quantity: quantity.qty,
            totalAmount: totalAmount
        });
    };
    const viewProduct = async (productID) => {

        navigate('/productdetail', { state: {productID,quantity} })
    }

    return (
        <div className='product-main-div'>
            {loading && <Spinner />}
            <div className="container text-center my-3">
                <div className="row">
                    {items.length !== 0 ?
                        items.map((p) => (
                            <div key={p._id} className="col-md-3 mb-4">
                                <div className="show-product p-3 border rounded">
                                    <div className='mx-2'>
                                        <img src={`${API_URL}${p.images[0]}`} style={{ transition: 'transform 0.3s ease' }} onClick={() => { viewProduct(p._id) }} className='img img-fluid' alt="Mobile" />
                                    </div>
                                    <h5 className='show-product-heading'>
                                        {p.productName.length > 20 ? p.productName.slice(0, 20) + '...' : p.productName}
                                    </h5>
                                    <p>Price: ${(parseFloat(p.prize).toFixed(2) / 84.68).toFixed(2)}</p>
                                    <label htmlFor="quantity">Qty :&nbsp;</label>
                                    <select name="quantity" id="quantity" onChange={onChange}>
                                        <option value="" disabled>select</option>
                                        {[...Array(10)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </select><br />
                                    <div className='d-flex justify-content-between mt-2'>
                                        <button className="btn buy-product-btn" onClick={(e) => onBuy(e, p)} type="button">Buy Now</button>
                                        <button className="btn cart-btn" onClick={(e) => onCart(e, p)} type="button">Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        )) :
                        <div>
                            <img style={{ height: '250px', width: '300px', marginTop: '40px' }} src='empty.jpg' alt="product not found" />
                            <p>Not Available</p>
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default Product;
