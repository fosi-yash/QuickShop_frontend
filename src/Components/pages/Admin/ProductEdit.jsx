import React, { useEffect, useRef, useState } from 'react';
import { getTokenWithExpiry } from '../../../utils/auth';
import { useNavigate } from 'react-router';
import { useAdmin } from './AdminContext';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../css/admin/ProductEdit.css';

const ProductEdit = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const {
    fetchProducts,
    product,
    productRemove,
    findproduct,
    particularProduct,
    categories,
    setParticularProduct,
    updateProduct
  } = useAdmin();
  const [searchBarText, setSearchBarText] = useState('');
  const [show, setShow] = useState(false);
  const [imageIndex, setImageIndex] = useState(0)
  const [img, setImg] = useState(null)
  const addimage = useRef(null)
  const [insertedImage,setInsertedImage]=useState(null)

  // Check authentication and role
  useEffect(() => {
    const checkAuthAndLoadProducts = async () => {
      const token = await getTokenWithExpiry('token');
      const role = await getTokenWithExpiry('role');

      if (role !== 'admin' || !token) {
        return navigate('/login');
      }
      console.log(insertedImage);

    };

    checkAuthAndLoadProducts();
  }, [navigate]);



  // Sync products from context
  useEffect(() => {
    // fetchProducts()
    setAllProducts(product);
  }, [product]);

  // Handle search
  const searchChange = (e) => {
    setSearchBarText(e.target.value);
    fetchProducts(e.target.value); // fixed: use current value not old state
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setParticularProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addImage = () => {
    if (addimage.current) {
      addimage.current.click()
    }
  }
  const handleImage = (e) => {

    setInsertedImage(e.target.files[0])
  }

  return (
    <div className="pb-3" style={{ backgroundColor: '#eaeef4', minHeight: '100vh' }}>
      <div className="w-50 searchbar my-3 mx-auto mb-3">
        <input
          className="form-control"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={searchBarText}
          onChange={searchChange}
        />
      </div>

      {/* Modal for editing */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header style={{ backgroundColor: '#A7BDD2' }} closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#EAEEF4' }}>
          <div>
            <div className='d-flex justify-content-center'>
              <div className='retrived_image'>
                <i className="fa-solid fa-xl fa-circle-chevron-left" onClick={() => { imageIndex !== 0 && setImageIndex(imageIndex - 1) }}></i>
                <img
                  src={`http://localhost:3000${particularProduct.images?.[imageIndex] || '/default-image.jpg'}`}
                  alt="productImage"
                  className="edit-product-img mt-1 rounded mb-4"
                  onError={(e) => (e.target.src = '/default-image.jpg')}
                />
                <i className="fa-solid fa-xl fa-circle-chevron-right" onClick={() => { particularProduct.images.length - 1 !== imageIndex && setImageIndex(imageIndex + 1) }}></i>
              </div>
              <div className='text-center rounded  add-more-image-div'><i className="fa-solid fa-plus add-more-image-icon fa-2xl" onClick={addImage}></i><p className='text-center'>Add more</p></div>
            </div>
            <div className="mb-3">
              <h6 className="form-label">Product Name:</h6>
              <input
                className="form-control rounded w-70"
                onChange={handlechange}
                type="text"
                name="productName"
                value={particularProduct.productName}
              />
            </div>
            <div className="mb-3">
              <h6 className="form-label">Description:</h6>
              <textarea
                className="form-control"
                onChange={handlechange}
                name="description"
                value={particularProduct.description}
              />
            </div>
            <div className="mb-3">
              <h6 className="form-label">Price:</h6>
              <input
                className="form-control"
                onChange={handlechange}
                type="text"
                name="prize"
                value={particularProduct.prize}
              />
            </div>
            <div className="mb-3">
              <h6 className="form-label">Stock:</h6>
              <input
                className="form-control"
                onChange={handlechange}
                type="text"
                name="stock"
                value={particularProduct.stock}
              />
            </div>
            <div className="mb-3">
              <h6 className="form-label">Category:</h6>
              <select
                className="form-control"
                name="category"
                value={particularProduct.category?._id || particularProduct.category}
                onChange={handlechange}
              >
                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.categoryname}
                  </option>
                ))}
              </select>
            </div>
            <input className='d-none' ref={addimage} accept="image/*" type='file' name='images' onChange={(e) => { handleImage(e) }} />
          </div>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: 'rgba(167,189,210,0.5)' }}>
          <Button variant="secondary" onClick={() => { setImageIndex(0); setShow(false) }}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              updateProduct(particularProduct._id,insertedImage);
              setImageIndex(0)
              setShow(false);
              
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Product list */}
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
            <div className="p-1 shadow-sm rounded" key={index}>
              <div className="mt-1 d-flex p-1 pt-2" style={{ backgroundColor: '#f5f7fa' }}>
                <div className="p-2">
                  <img
                    src={`http://localhost:3000${item.images?.[0]}`}
                    style={{ height: '160px', width: '180px' }}
                    alt="product"
                  // onError={(e) => (e.target.src = '/default-image.jpg')}
                  />
                </div>
                <div className="w-75 d-flex flex-column justify-content-center text-start ms-3">
                  <h6>Product Name: {item.productName}</h6>
                  <h6 className="mt-2">Description: {item.description.slice(0, 50)}...</h6>
                  <h6 className="mt-2">
                    Price: ${(parseFloat(item.prize).toFixed(2) / 85.62).toFixed(2)}
                  </h6>
                  <h6 className="mt-2">Stock: {item.stock}</h6>
                  <h6 className="mt-2">Category: {item.category?.categoryname}</h6>

                </div>
                <div className="d-flex justify-content-center align-items-center w-25">
                  <button
                    className="btn btn-danger me-1"
                    type="button"
                    onClick={() => productRemove(item._id)}
                  >
                    Remove
                  </button>
                  <button
                    className="btn btn-primary ms-1"
                    type="button"
                    onClick={() => {
                      findproduct(item._id);
                      setImageIndex(0)
                      setShow(true);
                    }}
                  >
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
