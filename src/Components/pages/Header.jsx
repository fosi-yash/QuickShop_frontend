import React, { useEffect } from 'react'
import logo from '../../assets/images/Logo.png'
import Navbar from './Navbar'
import '../../css/Header.css'
import { useLocation, useNavigate } from 'react-router'
import { useCart } from './user/CartContext'
import { getTokenWithExpiry } from '../../utils/auth'

const Header = () => {
    const { cartItems, fetchProducts, searchBarText, setSearchBarText, userData, fetchuser } = useCart();
    const location = useLocation()
    const navigate = useNavigate()
    const role = getTokenWithExpiry('role');
    const token = getTokenWithExpiry('token')
    const API_URL = import.meta.env.VITE_BACKEND_API;

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
                    {(location.pathname === '/success' || role === 'admin' || location.pathname === '/checkout' || location.pathname === '/cancel') ? "" : (
                        // <div className="position-relative" style={{ width: '500px' }}>
                        <input
                            className="center-placeholder searchbar"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchBarText}
                            onChange={searchChange}
                        />
                        // </div>
                    )}</div>



                <div className="w-25 header-right">
                    <div className="ms-auto position-relative me-3 ">
                        {role !== 'admin' && (
                            <>
                                <i className={`fa-solid fa-cart-shopping fa-xl profile-icon ${userData.profilephoto && "mt-3"} `} onClick={goCart} style={{ cursor: 'pointer', color: '#36506b' }}></i>
                                {(location.pathname === '/product' || location.pathname === '/productdetail') && cartItems.length > 0 ? (
                                    <span className="cart-badge">{cartItems.length}</span>
                                ):("")}
                            </>
                        )}
                    </div>
                    <div className="button-container me-3">
                        {userData.profilephoto ?
                            <img src={`${API_URL}${userData.profilephoto}`} className='profile-image rounded-circle' alt="Profile" /> :

                            <i className="fa-solid fa-user profile-icon  fa-xl" style={{ color: '#36506b' }}></i>
                        }
                        {!token ? (<ul className={` hover-list`}>
                            <li onClick={() => { navigate('/login') }}>Login</li>
                        </ul>) : (
                            <ul className={` hover-list`}>
                                <li onClick={() => { navigate('/profile') }}>Your Profile</li>

                                {role === 'user' && <li onClick={() => { navigate('/orders') }}> Your Orders</li>}
                                <li onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/login') }}>Logout</li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
