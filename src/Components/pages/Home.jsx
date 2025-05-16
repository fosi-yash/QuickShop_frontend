import React, { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import '../../css/Home.css'
import { useCart } from './user/CartContext'

const Home = () => {
  const {fetchProducts,category,setSearchBarText}=useCart()
  const navigate=useNavigate()
  useEffect(()=>{
    setSearchBarText('')
  },[])
  return (
    <div style={{backgroundColor:'#eaeef4'}}>
       <section className="hero  text-center py-5">
    <div className="container">
      <h1 className="display-4">Welcome to QuickShop</h1>
      <p className="lead">Discover amazing products at great prices!</p>
      <Link className="btn btn-primary btn-lg" to='/product'>Shop Now</Link>
    </div>
  </section>

  
  <section id="products" className="py-5">
    <div className="container">
      <h2 className="text-center mb-4">Featured Products</h2>
      <div className="row">
        {category.map((item,index)=>(

          <div key={item._id} className="col-md-4">
          <div className="card product-card mb-4">
            <img src={`http://localhost:3000${item.images}`}className=" product-image" alt={item.categoryname} />
            <div className="card-body text-center">
              <h5 className="card-title">{item.categoryname}</h5>
              {/* <p className="card-text">$299</p> */}
              <button onClick={()=>{  setSearchBarText(item.categoryname); navigate('/product');}} className="btn btn-outline-primary">Buy Now</button>
            </div>
          </div>
        </div>
        ))}
        
        
      </div>
    </div>
  </section>
  <section className="testimonial py-5">
    <div className="container">
      <h2 className="text-center mb-4">What Our Customers Say</h2>
      <div className="row">
        <div className="col-md-4">
          <div className="card text-center p-3">
            <p>"Amazing quality and fast delivery. Highly recommend!"</p>
            <h6 className="mt-2">– Sarah J.</h6>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3">
            <p>"Great customer service and a smooth shopping experience."</p>
            <h6 className="mt-2">– Mark W.</h6>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center p-3">
            <p>"I love the product selection. Will shop again!"</p>
            <h6 className="mt-2">– Emily R.</h6>
          </div>
        </div>
      </div>
    </div>
  </section>

  
  <section className="updated-section text-white text-center py-5">
    <div className="container">
      <h2 className="mb-3">Stay Updated</h2>
      <p>Subscribe to our newsletter and get the latest deals!</p>
      <form className="row justify-content-center mt-4">
        <div className="col-md-6">
          <input type="email" className="form-control form-control-lg" placeholder="Enter your email" required/>
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-light btn-lg">Subscribe</button>
        </div>
      </form>
    </div>
  </section>
    </div>
  )
}

export default Home
