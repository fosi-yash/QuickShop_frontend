import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Components/pages/Home';
import Signup from './Components/pages/Signup';
import Login from './Components/pages/Login';
import Paypal from './Components/pages/Paypal';
import ValidUser from './Components/pages/user/ValidUser';
import Cart from './Components/pages/user/Cart';
import Product from './Components/pages/Product';
import PaymentSuccess from './Components/pages/user/PaymentSuccess';
import PaymentCancel from './Components/pages/user/PaymentCancel';
import Orders from './Components/pages/user/Orders';
import OrderDetails from './Components/pages/user/OrderDetails';
import Addproducts from './Components/pages/Admin/Addproducts';
import { ShippingProvider } from './Components/pages/user/AddressContext';
import { CartProvider } from './Components/pages/user/CartContext';
import Navbar from './Components/pages/Navbar';
import ScrollToTop from './Components/ScrollToTop';
import ProductEdit from './Components/pages/Admin/ProductEdit';
import Dashboard from './Components/pages/Admin/Dashboard';
import Header from './Components/pages/Header';
import Contact from './Components/pages/Contact';
import About from './Components/pages/About';



const AppWrapper = () => {
  const location = useLocation();

  return (
    <CartProvider>
      <ShippingProvider>
      {/* Only show Navbar if not on /checkout */}
        <div className='sticky-top w-100'>
      <Header/>
        
        </div>
      <Navbar/>
   

        <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<ValidUser><Product /></ValidUser>} />
        <Route path="/cart" element={<ValidUser><Cart /></ValidUser>} />
        <Route path="/checkout" element={<ValidUser><Paypal/></ValidUser>} />
        <Route path="/success" element={<ValidUser><PaymentSuccess /></ValidUser>} />
        <Route path="/cancel" element={<ValidUser><PaymentCancel /></ValidUser>} />
        <Route path="/orders" element={<ValidUser><Orders /></ValidUser>} />
        <Route path="/orderdetails" element={<ValidUser><OrderDetails /></ValidUser>} />
        <Route path="/addproducts" element={<ValidUser><Addproducts /></ValidUser>} />
        <Route path="/productedit" element={<ValidUser><ProductEdit /></ValidUser>} />
        <Route path="/dashboard" element={<ValidUser><Dashboard /></ValidUser>} />
        
      </Routes>
      </ShippingProvider>
    </CartProvider>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
