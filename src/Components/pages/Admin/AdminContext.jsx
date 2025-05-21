import { createContext, useContext, useEffect, useState } from "react";
import { getTokenWithExpiry } from "../../../utils/auth";
import { useNavigate } from 'react-router-dom'

const AdminContext = createContext()

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const authtoken = getTokenWithExpiry('token')
    const [product, setProduct] = useState([])
    const [order, setOrder] = useState([])
    const [user, setUser] = useState([])
    const [chartdata, setChartdata] = useState([])
    const [categories,setCategories]=useState([])
    const [particularProduct, setParticularProduct] = useState({
        _id:"",
        productName: "",
        description: "",
        prize: "",
        stock: "",
        category: "",
        images: ""
    })



    // ============================= fetching all products ========================>

    async function fetchProducts(search) {

        const searchProduct = search || ""

        try {
            const response = await fetch(`http://localhost:3000/product?search=${searchProduct}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": authtoken
                }
            });
            const data = await response.json();
            setProduct(data);

        } catch (error) {
            console.error("Failed to fetch products:", error);
        }

    }

// =================================== Fetch All Orders ==============================>

    const fetchorder = async () => {
        const response = await fetch('http://localhost:3000/allorders', {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
                "auth-token": authtoken
            }
        })
        const data = await response.json()
        setOrder(data)
    }

// =================================== Fetch All Users ==============================>

    const fetchusers = async () => {
        const response = await fetch('http://localhost:3000/getusers', {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json',
                "auth-token": authtoken
            }
        })
        const data2 = await response.json()
        setUser(data2)
    }

// =================================== Fetching chart data ==============================>

    const fetchchartdata = async () => {
        const response = await fetch('http://localhost:3000/monthly-summary', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": authtoken
            }
        })
        const data = await response.json();
        setChartdata(data)
    }

// =================================== Remove Product by ID ==============================>

    const productRemove = async (id) => {
        const response = await fetch(`http://localhost:3000/removeproduct/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authtoken
            }
        })
        const data = await response.json()
        console.log(data)
        fetchProducts()
    }

// =================================== Finding Product By ID ==============================>

    const findproduct = async (id) => {
        const response = await fetch(`http://localhost:3000/findproduct/${id}`, {
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

    // ============================== Fetching All Category ==========================>
        const fetchcategories=async()=> {

        const response = await fetch('http://localhost:3000/category', {
            method: 'GET',
            headers: {
                "auth-token": authtoken,
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        setCategories(data)

    }

    // ============================== Update Product ================================>

       const updateProduct = async (_id) => {
  const id = _id;
  const formData = new FormData();
  formData.append('productName', particularProduct.productName);
  formData.append('description', particularProduct.description);
  formData.append('prize', particularProduct.prize);
  formData.append('stock', particularProduct.stock);
  formData.append(
    'category',
    typeof particularProduct.category === 'object'
      ? particularProduct.category._id
      : particularProduct.category
  );
  formData.append('images', particularProduct.images);

  try {
    const response = await fetch(`http://localhost:3000/updateproduct/${id}`, {
      method: 'PUT',
      headers: {
        'auth-token': authtoken,
      },
      body: formData,
    });

    const data = await response.json();
    console.log(data);
    fetchProducts();
  } catch (error) {
    console.error("Failed to update product:", error);
  }
};


    useEffect(() => {
        fetchProducts()
        fetchorder()
        fetchusers()
        fetchchartdata()
        fetchcategories()
    }, [])
    return (
        <AdminContext.Provider value={{ product, order, user, chartdata, fetchProducts, productRemove, findproduct,particularProduct,setParticularProduct ,categories, updateProduct}}>
            {children}
        </AdminContext.Provider>
    )
}