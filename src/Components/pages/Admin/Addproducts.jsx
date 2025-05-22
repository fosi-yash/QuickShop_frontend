import React, { useEffect, useState, useRef } from 'react';
import { getTokenWithExpiry } from '../../../utils/auth';
import { useNavigate } from 'react-router';

const Addproducts = () => {
  const [data, setData] = useState({
    productName: '',
    description: '',
    prize: '',
    stock: '',
    category: ''
  });

  const [images, setImages] = useState([]); // updated to support multiple images
  const [categorydata, setCategorydata] = useState({
    categoryname: '',
    description: ''
  });
  const [categoryimage, setCategoryimage] = useState(null);
  const [categories, setCategories] = useState([]);
  const modalref = useRef(null);
  const navigate = useNavigate();

  const token = getTokenWithExpiry('token');
  const role = getTokenWithExpiry('role');

  useEffect(() => {
    if (role !== 'admin' || !token) return navigate('/login');
    fetchcategories();
  }, []);

  const fetchcategories = async () => {
    const response = await fetch('http://localhost:3000/category', {
      method: 'GET',
      headers: {
        'auth-token': token,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    setCategories(data);
  };

  const handleChange = (e) => {
    if (e.target.value === 'add-new') {
      modalref.current.click(); // Open modal
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const handleImages = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return alert('Select at least one image');
    if (!data.category) return alert('Please select a category');

    const formData = new FormData();
    formData.append('productName', data.productName);
    formData.append('description', data.description);
    formData.append('prize', data.prize);
    formData.append('stock', data.stock);
    formData.append('category', data.category);

    images.forEach((img) => formData.append('images', img)); // multiple images

    const response = await fetch('http://localhost:3000/addproduct', {
      method: 'POST',
      headers: {
        'auth-token': token
      },
      body: formData
    });

    const data2 = await response.json();
    console.log(data2);

    setData({
      productName: '',
      description: '',
      prize: '',
      stock: '',
      category: ''
    });
    setImages([]);
  };

  const categoryChange = (e) => {
    setCategorydata({ ...categorydata, [e.target.name]: e.target.value });
  };

  const handlecategoryImage = (e) => {
    setCategoryimage(e.target.files[0]);
  };

  const categorySubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('categoryname', categorydata.categoryname);
    formData.append('description', categorydata.description);
    formData.append('images', categoryimage);

    const response = await fetch('http://localhost:3000/addcategory', {
      method: 'POST',
      headers: {
        'auth-token': token
      },
      body: formData
    });

    const categoryresponse = await response.json();
    console.log(categoryresponse);
    modalref.current.click();
    fetchcategories();
  };

  return (
    <div className="container mt-5">
      {/* Hidden modal trigger */}
      <button type="button" ref={modalref} className="btn d-none btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      {/* Modal for adding new category */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <form onSubmit={categorySubmit}>
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Category</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="p-4 border rounded shadow bg-white">
                  <div className="mb-3">
                    <input type="text" name="categoryname" className="form-control" value={categorydata.categoryname} onChange={categoryChange} placeholder='Enter Category Name' required />
                  </div>
                  <div className="mb-3">
                    <textarea name="description" className="form-control" value={categorydata.description} onChange={categoryChange} placeholder='Description' required />
                  </div>
                  <div className="mb-3">
                    <input type="file" name="image" className="form-control" accept="image/*" placeholder='Select Image' onChange={handlecategoryImage} />
                  </div>
                </div>
              </div>
              <div className="modal-footer text-center d-flex">
                <div className='w-100 h-100'>
                  <button type="submit" className="btn btn-primary">ADD CATEGORY</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Product form */}
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
        <h2 className="mb-4">Add Product</h2>

        <div className="mb-3">
          <label className="form-label">Product Category</label>
          <select name="category" value={data.category} onChange={handleChange} className="form-control" id="category">
            <option value="" disabled>Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryname}
              </option>
            ))}
            <option value="add-new">➕ Add New Category</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input type="text" name="productName" className="form-control" value={data.productName} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea name="description" className="form-control" value={data.description} onChange={handleChange} required></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" name="prize" className="form-control" value={data.prize} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Product Images</label>
          <input type="file" name="images" className="form-control" accept="image/*" multiple onChange={handleImages} />
        </div>

        <div className="mb-3">
          <label className="form-label">Stock Quantity</label>
          <input type="number" name="stock" className="form-control" value={data.stock} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Addproducts;
