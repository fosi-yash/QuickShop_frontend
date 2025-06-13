import { createContext, useContext, useEffect, useState } from "react";
import { getTokenWithExpiry } from "../../../utils/auth";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [items, setItems] = useState([]);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        birthdate: "",
        mobilenumber: "",
        profilephoto: ""
    });
    const [particularProduct, setParticularProduct] = useState({
        _id:"",
        productName: "",
        description: "",
        prize: "",
        stock: "",
        category: "",
        images: []
    })
    const [authtoken, setAuthtoken] = useState(getTokenWithExpiry('token'));
    const [searchBarText, setSearchBarText] = useState('');
    const [category, setCategory] = useState([]);

    // ============================= fetching all products ========================>  
    const fetchProducts = async (search = "") => {
        const token = getTokenWithExpiry('token');
        if (!token) return;

        try {
            const response = await fetch(`/api/product?search=${search}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                }
            });
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    // ============================= Add Product To Cart  ========================>  
    const addtocart = async (product) => {
        const token = getTokenWithExpiry('token');
        setCartItems(prev => [...prev, product]);

        await fetch('/api/addtocart', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(product)
        });
    };

    // ============================= Remove Product ========================>
    const removeCart = async (id) => {
        const token = getTokenWithExpiry('token');
        await fetch(`/api/removecart/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            }
        });
        setCartItems(prev => prev.filter(item => item._id !== id));
    };

    // ============================= Remove All Products ========================>
    const emptyCart = async () => {
        const token = getTokenWithExpiry('token');
        await fetch('/api/removeall', {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            }
        });
        setCartItems([]);
    };

    // ======================= Fetching All Category ===============================>
    const fetchCategory = async () => {
        const token = getTokenWithExpiry('token');
        const res = await fetch('/api/category', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                
            }
        });
        const data = await res.json();
        setCategory(data);
    };

    // ============================ Get User ==========================>
    const fetchuser = async () => {
        const token = getTokenWithExpiry('token');
        const response = await fetch('/api/getuser', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        });
        const data = await response.json();
        setUserData({
            name: data.name,
            email: data.email,
            birthdate: data.birthdate || "",
            mobilenumber: data.mobilenumber || "",
            profilephoto: data.profilephoto
        });
    };

    // =================================== Finding Product By ID ==============================>

    const findproduct = async (id) => {
        const response = await fetch(`/api/findproduct/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
                "auth-token": authtoken
            }
        })
        const product = await response.json()
        setParticularProduct({
            _id:product._id,
            productName: product.productName,
            description: product.description,
            prize: product.prize,
            stock: product.stock,
            category: product.category,
            images: product.images
        })
    }

    // ============================= UseEffect ========================>
    useEffect(() => {
        const token = getTokenWithExpiry('token');
        setAuthtoken(token);

        if (!token) return;

        const fetchcart = async () => {
            try {
                const response = await fetch('/api/cart', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCartItems(data);
                } else {
                    setCartItems([]);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchcart();
        fetchuser();
        fetchCategory();
    }, []);

    return (
        <CartContext.Provider value={{
            items,
            category,
            cartItems,
            fetchCategory,
            setSearchBarText,
            searchBarText,
            fetchProducts,
            emptyCart,
            addtocart,
            removeCart,
            userData,
            setUserData,
            fetchuser,
            findproduct,
            particularProduct
        }}>
            {children}
        </CartContext.Provider>
    );
};
