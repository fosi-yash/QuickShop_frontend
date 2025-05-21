import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './user/CartContext';
import '../../css/Navbar.css'
import { getTokenWithExpiry } from '../../utils/auth';

const Navbar = () => {
    const role = getTokenWithExpiry('role');
    const navigate = useNavigate();
    const { cartItems, fetchProducts, searchBarText, setSearchBarText } = useCart();
    const location = useLocation();

    return role === "user" ? (
        <nav className="navbar navbar-expand-lg">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse p-1" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/product">Product</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">AboutUs</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/contact">Contact</Link>
                    </li>
                </ul>
            </div>
        </nav>
    ) : (
        <nav className="navbar navbar-expand-lg">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse p-1" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/dashboard">Dashboard <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/productedit">Products</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/about">User</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/contact">Contact</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
