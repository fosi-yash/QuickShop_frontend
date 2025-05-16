import React, { useEffect } from 'react'
import logo from '../../assets/images/Logo.png'
import Navbar from './Navbar'
import '../../css/Header.css'
import { useLocation, useNavigate } from 'react-router'
import { useCart } from './user/CartContext'

const Header = () => {
    const { cartItems, fetchProducts, searchBarText, setSearchBarText } = useCart();
    const location = useLocation()
    const navigate = useNavigate()

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

    const goCart = () => {
        navigate('/cart');
    };
    return (
        <>
            <div className='header d-flex'>
                <div className='w-25 '>
                    <img src={logo} className='logo-image' alt="LOGO" />
                </div>
                <div className="w-50 searchbar ">
                    {(location.pathname === '/success' || location.pathname === '/checkout' || location.pathname === '/cancel') ? "" : (
                        // <div className="position-relative" style={{ width: '500px' }}>
                        <input
                            className="center-placeholder"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchBarText}
                            onChange={searchChange}
                        />
                        // </div>
                    )}</div>
                <div className="w-25 header-right"> <div className="ms-auto position-relative me-4 ">
                    <i className="fa-solid fa-cart-shopping fa-xl " onClick={goCart} style={{ cursor: 'pointer', color: '#36506b' }}></i>
                    {location.pathname === '/product' && cartItems.length > 0 && (
                        <span className="cart-badge">
                            {cartItems.length}
                        </span>
                    )}
                </div>
                    <div className="button-container me-3">
                        <i className="fa-solid fa-user fa-xl" style={{ color: '#36506b' }}></i>

                        <ul className={` hover-list`}>
                            <li>Your Profile</li>
                            <li onClick={() => { navigate('/orders') }}> Your Orders</li>
                            <li onClick={() => { localStorage.removeItem('token'); navigate('/login') }}>Logout</li>
                        </ul>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Header
