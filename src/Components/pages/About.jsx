import React from 'react';
import logo from '../../assets/images/Logo.png'

const About = () => {
  return (
    <div style={{backgroundColor:'#eaeef4'}}>
    <div className="container my-5">
      <h2 className="text-center mb-4" style={{ color: '#36506B' }}>About QuickShop</h2>

      <div className="row align-items-center">
        <div className="col-md-6 mb-4">
          <img
            src={logo}
            alt="About QuickShop"
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-6">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            <strong style={{ color: '#36506B' }}>QuickShop</strong> is your one-stop online store for all your shopping needs.
            From fashion to electronics, we bring you the best deals, fastest delivery, and a seamless shopping experience.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            We are committed to quality, affordability, and customer satisfaction. Our platform is built using the latest
            technology to provide a secure and user-friendly interface. Whether you're shopping from your desktop or mobile,
            we ensure a smooth experience every time.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            Thank you for choosing <strong style={{ color: '#36506B' }}>QuickShop</strong>. We are constantly growing and improving to
            serve you better.
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default About;
