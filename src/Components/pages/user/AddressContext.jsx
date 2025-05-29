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
    landmark: "",
    display_name:""
  });
  const [shipping, setShipping] = useState(0)

  const [user, setUser] = useState({
    Latitude: '',
    Longitude: ''
  });

  const [seller, setSeller] = useState({
    Latitude: '28.4646148',
    Longitude: '77.0299194'
  });


  const userLocation = () => {
    console.log('hello Location')
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
              state: `${location.address.state}, ${location.address.country}`,
              display_name:location.display_name
            });
          } catch (error) {
            console.log('Error in fetching location', error);
          }
        }
      );
    }
  };
  // ================== convert user addresss to coordinate =================>

  const getCoordinates = async (address) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await res.json();
  console.log(data)
  if (data && data.length > 0) {
    setUser({
      Latitude: parseFloat(data[0].lat),
    Longitude: parseFloat(data[0].lon)
    })
    getDistanceFromLatLonInKm()
    // return {
    //   lat: parseFloat(data[0].lat),
    //   lng: parseFloat(data[0].lon),
    // };
  } else {
    throw new Error("Unable to geocode address");
  }
};

  // Haversine formula to calculate distance between two lat/long points ======>

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
    const distance = R * c; // Distance in km
    console.log(distance)
    if (distance < 20) {
      setShipping(Number((0).toFixed(2)))
    }
    if (distance > 100) {
      setShipping(Number((distance * 1.2 / 84.32).toFixed(2)));
    }
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  // ================= useEffect to call userLocation ==============>

  // useEffect(() => {
  //   // Optionally call userLocation to fetch user's location when component mounts
  //   userLocation();
    
  // }, [user.Latitude, user.Longitude, seller.Latitude, seller.Longitude]); // Dependency array for re-calculation

  return (
    <AddressContext.Provider value={{ getDistanceFromLatLonInKm,getCoordinates, shipping, userLocation, useraddress ,setUseraddress}}>
      {children}
    </AddressContext.Provider>
  );
};
