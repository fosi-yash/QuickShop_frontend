import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useCart } from './CartContext';
import '../../../css/ProductDetail.css';

const ProductDetail = () => {
    const location = useLocation();
    const { productID, quantity } = location.state;
    const API_URL = import.meta.env.VITE_BACKEND_API;
    const { findproduct,addtocart, particularProduct } = useCart();
    const [qty,setQty]=useState(1)
    const [selectedImage, setSelectedImage] = useState(0);
    const [cart, setCart] = useState([]);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
    const navigate=useNavigate()

    const onCart = (e, p) => {
        e.preventDefault();
        const totalAmount = p.prize * qty;
        addtocart({
            _id: p._id,
            productName: p.productName,
            prize: (parseFloat(p.prize).toFixed(2) / 84.68).toFixed(2),
            images: p.images[0],
            quantity: qty,
            totalAmount: totalAmount
        });
    };
    const onBuy = (e, p) => {
        e.preventDefault();
        const newCart = [...cart, {
            productName: p.productName,
            prize: (parseFloat(p.prize).toFixed(2) / 84.68).toFixed(2),
            quantity: qty,
            images: p.images[0]
        }];
        setCart(newCart);
        navigate('/checkout', { state: { cart: newCart } });
    };
    const onChange=(e)=>{
        setQty(e.target.value)
    }

    useEffect(() => {
        findproduct(productID);
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);

    }, [productID]);

    return (
        <div className="  detail-main-div ">
            <div className="d-flex">
                <div className="d-flex align-items-start  product-left-side p-4">
                    {/* Thumbnail Images */}
                    <div className="col-12 col-md-auto mt-5">
                        <ul
                            style={{
                                display: 'flex',
                                flexDirection: isDesktop ? 'column' : 'row',
                                gap: '8px',
                                listStyleType: 'none',
                                padding: 0,
                                margin: 0
                            }}
                        >
                            {particularProduct.images?.map((img, index) => (
                                <li key={index}>
                                    <img
                                        src={`${API_URL}${img}`}
                                        alt={`Thumbnail ${index}`}
                                        className={`img-thumbnail ${selectedImage === index ? 'border-primary' : ''}`}
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            border: selectedImage === index ? '2px solid #0d6efd' : '1px solid #ccc',
                                            borderRadius: '6px'
                                        }}
                                        onClick={() => setSelectedImage(index)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Product Image */}
                    <div className="mx-4 text-center">
                        <img
                            src={`${API_URL}${particularProduct.images?.[selectedImage]}`}
                            alt="Product"
                            className="img-fluid rounded shadow product-detail-main-image"
                            style={{ objectFit: 'contain' }}
                        />
                        <div className="d-flex justify-content-around  mt-3">
                            <button className="btn product-detail-btn btn-warning p-2 text-white" onClick={(e)=>{onCart(e,particularProduct)}}>
                                🛒 ADD TO CART
                            </button>
                            <button className="btn p-2 product-detail-btn text-white" onClick={(e)=>{onBuy(e,particularProduct)}} style={{ backgroundColor: '#fd7e14' }}>
                                ⚡ BUY NOW
                            </button>
                        </div>
                    </div>

                </div>
                {/* Product Details */}
                <div className='p-3' style={{ width: '70%' }}>

                    <h2 className="h4 mt-3 fw-bold" >{particularProduct.productName}</h2>
                    <h4 className="h4  my-4 w-75" >{particularProduct.description}</h4>
                    <div className="d-flex">
                            <label className='h5'>Price :&nbsp; </label>
                    <p className="h5 text-success "> ${(parseFloat(particularProduct.prize).toFixed(2) / 85.12).toFixed(2)}</p>
                    </div>
                    <div className="d-flex">

                    <label htmlFor="quantity" className='h5'>Qty :&nbsp;</label>
                    <select className='h5' name="quantity" id="quantity" onChange={onChange}>
                        <option value="" disabled>select</option>
                        {[...Array(10)].map((_, index) => (
                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                        ))}
                    </select>
                        </div>



                </div>
            </div>
            <div>
                <h2 className='ms-4'>Similar Product</h2>
                <div className="d-flex"></div>
            </div>
        </div>
    );
};

export default ProductDetail;
