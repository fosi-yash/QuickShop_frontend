import { createContext, useContext, useEffect, useState } from "react";

const AddressContext = createContext();

export const shippingContext = () => useContext(AddressContext);

export const ShippingProvider = ({ children }) => {
  const [useraddress, setUseraddress] = useState({
    name: "",
    number: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: ""
  });
  const[shipping,setShipping]=useState(10)
  
  const [user, setUser] = useState({
    Latitude: '',
    Longitude: ''
  });
  
  const [seller, setSeller] = useState({
    Latitude: '24.174051',
    Longitude: '72.433099'
  });

  const userLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUser({
            Latitude: latitude,
            Longitude: longitude
          });
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const location = await response.json();
            setUseraddress({
              ...useraddress,
              pincode: location.address.postcode,
              city: `${location.address.suburb || ""}, ${location.address.county.replace("Taluka", " ") || ""}, ${location.address.state_district || ""}`,
              state: `${location.address.state}, ${location.address.country}`
            });
          } catch (error) {
            console.log('Error in fetching location', error);
          }
        }
      );
    }
  };

  // Haversine formula to calculate distance between two lat/long points
  const getDistanceFromLatLonInKm = () => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(seller.Latitude - user.Latitude);
    const dLon = deg2rad(seller.Longitude - user.Longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(user.Latitude)) *
        Math.cos(deg2rad(seller.Latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance= R * c; // Distance in km
    if(distance<20){
              setShipping(0)
          }
          if(distance>100){
            setShipping(Number((distance * 1.2 / 84.32).toFixed(2))); 
          }
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  useEffect(() => {
    // Optionally call userLocation to fetch user's location when component mounts
    userLocation();
    
}, [user.Latitude, user.Longitude, seller.Latitude, seller.Longitude]); // Dependency array for re-calculation

  return (
    <AddressContext.Provider value={{ getDistanceFromLatLonInKm,shipping,userLocation, useraddress }}>
      {children}
    </AddressContext.Provider>
  );
};
