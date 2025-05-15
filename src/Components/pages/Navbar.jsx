import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './user/CartContext';
import '../../css/Navbar.css'

const Navbar = () => {
    const navigate = useNavigate();
    const { cartItems, fetchProducts, searchBarText, setSearchBarText } = useCart();
    const location = useLocation()
    // const [search, setSearch] = useState('')


    const goCart = () => {
        navigate('/cart');
    };

    useEffect(() => {
        fetchProducts(searchBarText)
    }, [searchBarText])
    const searchChange = (e) => {
        navigate('/product');
        setSearchBarText(e.target.value);
        fetchProducts(e.target.value);
    };
    const searchSubmit = (e) => {
        e.preventDefault()
        fetchProducts(searchBarText)
    }

    return (
        <nav className="navbar navbar-expand-lg   " style={{ backgroundColor: 'burlywood', }}>
            <Link className="navbar-brand ms-2" to="#"><em>QuickShop</em></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse p-1" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="product">Product</Link>
                    </li>


                    <li className="nav-item">
                        <Link className="nav-link " to="#">AboutUs</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link " to="#">Contact</Link>
                    </li>
                </ul>
                {(location.pathname === '/success' || location.pathname === '/checkout' || location.pathname === '/cancel') ? "" : (
                    <div className="position-relative" style={{ width: '500px' }}>
                        <input
                            className="form-control ps-3 pe-5"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchBarText}
                            onChange={searchChange}
                        />
                    </div>
                )}

            </div>
            <div className="ms-auto position-relative me-4 ">
                <i className="fa-solid fa-cart-shopping fa-xl " onClick={goCart} style={{ cursor: 'pointer' }}></i>
                {location.pathname === '/product' && cartItems.length > 0 && (
                    <span className="cart-badge">
                        {cartItems.length}
                    </span>
                )}
            </div>
            <div className="button-container me-3">
                <i className="fa-solid fa-user fa-xl"></i>

                <ul className={` hover-list`}>
                    <li>Your Profile</li>
                    <li onClick={() => { navigate('/orders') }}> Your Orders</li>
                    <li onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>Logout</li>
                </ul>
            </div>

        </nav>
    );
};

export default Navbar;
