import React, { useEffect, useState } from 'react'
import '../../../css/Adress.css'
import { shippingContext } from './AddressContext'
import { useNavigate } from 'react-router-dom'

import { getTokenWithExpiry } from '../../../utils/auth'


const Address = ({ onselectedaddress }) => {
  const token = getTokenWithExpiry('token')
  const role = getTokenWithExpiry('role')
  const { userLocation, useraddress, setUseraddress , getCoordinates, getDistanceFromLatLonInKm } = shippingContext()
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState()
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: "",
    number: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    display_name:""
  })

  const [display, setDisplay] = useState('d-none')


  // ======================== fetch adress function ========================>

  async function fetchaddress() {
    const response = await fetch('/api/addresses', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'auth-token': token
      }
    })
    const addresses = await response.json()
    setAddress(addresses)
  }

  //  ==================== useEffect to calling fetchaddress function ==================>

  useEffect(() => {
    fetchaddress()
  }, [])

  // ====================== navigate unauthorized User =========================>

  useEffect(() => {
    if (role !== 'user' || !token) {
      navigate('/login');
    }
  }, [role, token]);

  // ====================== submit the address in database ====================>

  const handleSubmit = async (e) => {
    e.preventDefault()
    getDistanceFromLatLonInKm()
    const response = await fetch('/api/addaddress', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'auth-token': token
      },
      body: JSON.stringify({
        name: data.name,
        number: data.number,
        pincode: data.pincode,
        locality: data.locality,
        address: data.address,
        city: data.city,
        state: data.state,
        landmark: data.landmark,
        display_name:useraddress.display_name
       
      })
    })
    const json = await response.json()
    setData({
      name: "",
      number: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      landmark: "",
      display_name:""
     
    })
    setUseraddress({
      ...useraddress,display_name:''
    })
    setDisplay('d-none')
    fetchaddress()
  }

  // ======================== Function to change the value ====================>

  const handleChange = (e) => {
    const { name, value } = e.target
    setData({
      ...data,
      [name]: value
    })

  }

  // =========== function to add feched data into input ===========>

  const fetchLocation = async() => {
    await userLocation()
    setData({
      ...data,
      city: useraddress.city,
      state: useraddress.state,
      pincode: useraddress.pincode,
      display_name:useraddress.display_name
    })
  }

  // ====================== Delete Address =======================>

  const removeAddress = async (e, id) => {
    e.preventDefault();
    const response = await fetch(`/api/address/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        'auth-token': token
      }
    })
    const user_address = await response.json()
    if (user_address) {
      fetchaddress()
    }
  }

  // function to change selected address & calling getCoordinates ==========>

  const onAddressSelect = async (e, user) => {
    setSelectedAddress(e.target.value);
    onselectedaddress(e.target.value);

      const fullAddress = user.display_name || ` ${user.city}, ${user.state}`;
      console.log(fullAddress);

      try {
        const {lat,lon} = await getCoordinates(fullAddress);
        await     getDistanceFromLatLonInKm(lat,lon)
 // <-- await + try-catch to handle failure
      } catch (error) {
        console.error("Failed to convert address to coordinates:", error.message);
        alert("Could not get coordinates for the selected address. Please check the address.");
      
    }
  };

  // ================ cancel funtion to close the address popup ==============>
  const onCancel = () => {
    setData({
      name: "",
      number: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      landmark: ""
    })
    setDisplay('d-none');
    setSelectedAddress()
  }


  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
  ];
  return (
    <>
      <div>
        {
          address.map((user, index) => (
            <div className="container d-flex bg-white mt-2 rounded" key={user._id}>
              <div>
                <input className='mx-3 mt-3' style={{ height: '25px', width: '20px', }} value={user._id} checked={selectedAddress === user._id} onChange={(e) => { onAddressSelect(e, user) }} type="radio" name="select" id="select" required />
              </div>
              <div className="w-75 mx-3">
                <div className='d-flex '>
                  <p className='mx-2 mt-1 mb-0' style={{ fontFamily: 'none', fontSize: 'larger' }}>{user.name}</p>
                  <p className='mx-1 mt-1 mb-0' style={{ fontFamily: 'none', fontSize: 'larger' }}>{user.number}</p>

                </div>
                <div>
                  <p className='text-start'>{`${user.address} , ${user.city} , ${user.state} - ${user.pincode}`}</p>
                </div>

              </div>
              <div className='w-25 text-end'>
                <i className="fa-duotone fa-solid fa-lg fa-trash me-4" onClick={(e) => { removeAddress(e, user._id) }} style={{ marginTop: '30px' }} ></i>

              </div>
            </div>
          ))
        }
        <div className="container d-flex bg-white mt-2 text-start rounded">
          <button className='btn mx-2' onClick={(e) => { e.preventDefault(); setDisplay('') }} style={{ border: 'none', background: 'none', width: 'max' }}><i className="fa-solid fa-xl fa-plus "></i> Add new address</button>

        </div>
      </div >
      <div className={`${display}`}>
        <div className="  ma-5 p-4 border rounded bg-light">

          <h2 className="text-center">Fill Address Details</h2>
          <hr />

          <div className="ms-5 justify-content-around mt-5">
            <button className='d-flex  btn btn-primary' onClick={(e)=>{e.preventDefault();fetchLocation()}}>

              <i className="fa-solid mx-1 mt-3 fa-xl fa-location-crosshairs"></i><h5 className='ms-2 mt-1'>Use Current Location</h5>
            </button>
          </div>
          <form onSubmit={handleSubmit} >
            <div className="d-flex justify-content-around mt-3">
              <input className='mx-2 form-control' type="text" name="name" value={data.name} placeholder='Name' onChange={handleChange} required autoComplete="off" />
              <input className='mx-2 form-control' type="tel" name="number" value={data.number} placeholder='Mobile Number' onChange={handleChange} required autoComplete="off" />
            </div>

            <div className="d-flex justify-content-around mt-3">
              <input className='mx-2 form-control' type="text" name="address" value={data.address} placeholder='Address (area and street)' onChange={handleChange} required autoComplete="off" />
              <input className='mx-2 form-control' type="text" name="locality" value={data.locality} placeholder='Locality (Optional)' onChange={handleChange} autoComplete="off" />

            </div>

            <div className="d-flex justify-content-around mt-3">
              <input className='mx-2 form-control' type="text" name="landmark" value={data.landmark} placeholder='Landmark (Optional)' onChange={handleChange} autoComplete="off" />
              <input className='mx-2 form-control' type="text" name="city" value={data.city} placeholder='City/District/Town' onChange={handleChange} required autoComplete="off" />

            </div>

            <div className="d-flex justify-content-around mt-3">
              <input className='mx-2 form-control' type="text" name="pincode" value={data.pincode} placeholder='Pincode' onChange={handleChange} required autoComplete="off" />
              <div className="mx-2 w-100">

                <input
                  list="states"
                  className="form-control"
                  type="text"
                  name="state"
                  value={data.state}
                  placeholder='State'
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
                <datalist id="states">
                  {indianStates.map((state, index) => (
                    <option value={state} key={index} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary mx-2 px-4">Save</button>
              <button type="button" onClick={onCancel} className="btn btn-danger mx-2 px-4">cancel</button>
            </div>
          </form>
        </div>
      </div>

    </>
  )
}

export default Address
