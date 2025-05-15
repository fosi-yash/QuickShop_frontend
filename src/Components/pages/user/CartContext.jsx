import { createContext, useContext, useEffect, useState } from "react";


const CartContext = createContext();

export const useCart = () => useContext(CartContext);
var loader = false

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const [items, setItems] = useState([])
    const authtoken = localStorage.getItem('token')
    const [searchBarText, setSearchBarText] = useState('')
    const [category,setCategory]=useState([])

    async function fetchProducts(search) {

        const searchProduct = search || ""

        try {
            const response = await fetch(`http://localhost:3000/product?search=${searchProduct}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": `${authtoken}`
                }
            });
            const data = await response.json();
            setItems(data);

        } catch (error) {
            console.error("Failed to fetch products:", error);
        }

    }


    const addtocart = async (product) => {
        loader = true

        setCartItems((previousCart) => [...previousCart, product])
        console.log(`${authtoken}`)
        const response = await fetch('http://localhost:3000/addtocart', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": `${authtoken}`
            },
            body: JSON.stringify(product)
        })
        const json = await response.json()
        loader = false
    }

    useEffect(() => {
        const fetchcart = async () => {
            const token = localStorage.getItem('token');
            if (!token) return; // Exit early if no token is found

            try {
                const response = await fetch('http://localhost:3000/cart', {
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
                    console.warn('Failed to fetch cart. Status:', response.status);
                    setCartItems([]); // clear cart if unauthorized
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchcart();
        fetchCategory()
    }, []);


    const removeCart = async (id) => {
        loader = true
        const response = await fetch(`http://localhost:3000/removecart/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "auth-token": `${authtoken}`
            },

        })
        setCartItems((previousCart) => previousCart.filter((item) => item._id !== id))
        loader = false
    }

    const emptyCart = async () => {
        loader = true
        const response = await fetch('http://localhost:3000/removeall', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": `${authtoken}`
            }
        })
        setCartItems([])
        loader = false
    }

 // ======================= Fetching All Category ==============================>

    const fetchCategory=async()=>{
        const categories=await fetch('http://localhost:3000/category',{
            method:'GET',
            headers:{
                'auth-token':authtoken,
                'Content-Type':'application/json'
            }
        }) 
        const response=await categories.json()
        setCategory(response)
    }




    return (
        <CartContext.Provider value={{ items, category, cartItems, setSearchBarText, searchBarText, fetchProducts, emptyCart, addtocart, removeCart }}>
            {children}
        </CartContext.Provider>
    )
}