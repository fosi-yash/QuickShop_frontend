import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../../../css/Profile.css'
import { useCart } from './CartContext';
import { getTokenWithExpiry } from '../../../utils/auth';

const Profile = () => {

  const authtoken = getTokenWithExpiry('token')
  const { userData, setUserData, fetchuser } = useCart()
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const profileref = useRef(null)



  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('birthdate', userData.birthdate);
    if (userData.mobilenumber !== "" && userData.mobilenumber !== 'undefined') {
      formData.append('mobilenumber', userData.mobilenumber || "");
    }
    if (imageFile) {
      formData.append('image', imageFile); // key should match multer field name: `image`
    }

    const response = await fetch('http://localhost:3000/updateprofile', {
      method: 'PUT',
      headers: {
        'auth-token': authtoken
      },
      body: formData
    })
    const data = await response.json()
    console.log(data)
    fetchuser()
    alert('Profile Updated Successfully')
  };

  return (
    <div className='profile-main-div'>
      <div className="container mt-5 ">
        <h2 className="text-center mb-4">User Profile</h2>

        {message && (
          <div className="alert alert-info text-center" role="alert">
            {message}
          </div>
        )}

        <div className="row justify-content-center mb-5">
          <div className="col-md-6 col-lg-5">

            <div className="card shadow p-4 profile-inner-div">
              <div className="text-center d-flex mb-4" style={{ margin: 'auto' }}>
                {userData.profilephoto ? (<>
                  <img
                    src={`http://localhost:3000${userData.profilephoto}`}
                    alt="Profile"
                    className="rounded-circle"
                    width="100"
                    height="100"
                    
                  />
                  <i className="fa-solid profile-edit-icon fa-xl fa-camera-rotate" onClick={() => {
                      if (profileref.current) {
                        profileref.current.click()
                      }
                    }}></i>
                </>
                ) : (
                  <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px', fontSize: '24px' }}>
                    ?
                  </div>
                )}
              </div>

              <form onSubmit={handleUpdate} encType="multipart/form-data">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={userData.mobilenumber || ""}
                    onChange={(e) => setUserData({ ...userData, mobilenumber: e.target.value })}
                    placeholder='Enter Mobile Number'

                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Birthdate</label>
                  <input
                    type="date"
                    className="form-control"
                    value={userData.birthdate}
                    onChange={(e) => setUserData({ ...userData, birthdate: e.target.value })}

                  />
                </div>

                <div className="mb-3 d-none">
                  <label className="form-label">Profile Photo</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    ref={profileref}
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Update Profile</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;