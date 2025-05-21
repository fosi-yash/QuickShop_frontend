import React, { useEffect, useState } from 'react';
import { getTokenWithExpiry } from '../../../utils/auth';
import { useNavigate } from 'react-router';
import { useAdmin } from './AdminContext';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/admin/ProductEdit.css'

const ProductEdit = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const { fetchProducts, product, productRemove, findproduct, particularProduct, categories, setParticularProduct , updateProduct } = useAdmin();
  const [searchBarText, setSearchBarText] = useState('')
  const [show, setShow] = useState(false);

  // 1. Check auth on mount
  useEffect(() => {
    const checkAuthAndLoadProducts = async () => {
      const token = await getTokenWithExpiry('token');
      const role = await getTokenWithExpiry('role');

      if (role !== 'admin' || !token) {
        return navigate('/login');
      }
    };

    checkAuthAndLoadProducts();
  }, [navigate]);

  // 3. Sync local state with product context
  useEffect(() => {
    setAllProducts(product);
  }, [product]);

  // Handle search input change
  const searchChange = (e) => {
    setSearchBarText(e.target.value);
    fetchProducts(searchBarText);
  };

 const handlechange = (e) => {
  const { name, value } = e.target;
  setParticularProduct(prev => ({
    ...prev,
    [name]: value
  }));
};

  return (

    <div style={{ backgroundColor: '#eaeef4', minHeight: '100vh' }}>
      <div className="w-50 searchbar my-3 mx-auto">
        <input
          className="form-control"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={searchBarText}
          onChange={searchChange}
        />
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header style={{ backgroundColor: '#A7BDD2' }} closeButton>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#EAEEF4' }}><div>
          <img src={`http://localhost:3000${particularProduct.images}`} alt="productImage" className='edit-product-img mt-1 mb-4' />
          <div className="mb-3 ">
            <h6 className='form-label'>Product Name : </h6><input className='form-control rounded w-70' onChange={handlechange} type="text" name="productName" id="productName" value={particularProduct.productName} />
          </div>
          <div className="mb-3 ">
            <h6 className='form-label'>Description : </h6><textarea className='form-control' onChange={handlechange} type="text" name="description" id="description" value={particularProduct.description} />
          </div>
          <div className="mb-3 ">
            <h6 className='form-label'>Price : </h6><input className='form-control' onChange={handlechange} type="text" name="prize" id="prize" value={particularProduct.prize} />
          </div>
          <div className="mb-3 ">
            <h6 className='form-label'>Stock : </h6><input className='form-control' onChange={handlechange} type="text" name="stock" id="stock" value={particularProduct.stock} />
          </div>
          <div className="mb-3 ">
            <h6 className='form-label'>Category : </h6>
            <select
              className='form-control'
              name="category"
              id="category"
              value={particularProduct.category._id || particularProduct.category}
              onChange={handlechange}
            >
              {
                categories.map((item, index) => (
                  <option key={item._id} value={item._id}>{item.categoryname}</option>
                ))
              }
            </select>

          </div>
        </div></Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'rgba(167,189,210,0.5)' }}>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() =>{updateProduct(particularProduct._id); setShow(false)}}>
            Save Changes
          </Button>
        </Modal.Footer >
      </Modal>

      <div className="container text-center">
        {allProducts.length === 0 ? (
          <div
            style={{
              height: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h3>No Products Found</h3>
          </div>
        ) : (

          allProducts.map((item, index) => (
            <div className="p-1 shadow-sm rounded " key={index + 1}>
              <div className="mt-1 d-flex p-1 pt-2" style={{ backgroundColor: '#f5f7fa' }}>
                <div className="p-2">
                  <img
                    src={`http://localhost:3000${item.images}`}
                    style={{ height: '160px', width: '180px' }}
                    alt=""
                  />
                </div>
                <div className="w-75 d-flex flex-column justify-content-center text-start ms-3">
                  <h6>Product Name : {item.productName}</h6>
                  <h6 className="mt-2">
                    Description : {item.description.slice(0, 50)}...
                  </h6>
                  <h6 className="mt-2">
                    Price : ₹{(parseFloat(item.prize).toFixed(2) / 85.62).toFixed(2)}
                  </h6>
                  <h6 className="mt-2">Stock : {item.stock}</h6>
                  <h6 className="mt-2">Category : {item.category.categoryname}</h6>
                </div>
                <div className="d-flex  justify-content-center align-items-center  w-25 ">
                  <button className="btn btn-danger me-1" type="button" onClick={() => productRemove(item._id)}>
                    Remove
                  </button>
                  <button className="btn btn-primary ms-1" type="button" onClick={() => { findproduct(item._id); setShow(true) }}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))


        )}

      </div>
    </div>

  );
};

export default ProductEdit;
