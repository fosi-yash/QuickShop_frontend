import { createContext, useContext, useEffect, useState } from "react";
import { getTokenWithExpiry } from "../../../utils/auth";
import {useNavigate} from 'react-router-dom'

const AdminContext = createContext()

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
    const authtoken=getTokenWithExpiry('token')
    
   

    const [product, setProduct] = useState([])
    const [order, setOrder] = useState([])
    const [user, setUser] = useState([])
    const [chartdata, setChartdata] = useState([])

    // ============================= fetching all products ========================>

    async function fetchProducts() {

        const searchProduct = ""
        try {
            const response = await fetch(`http://localhost:3000/product?search=${searchProduct}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": `${authtoken}`
                }
            });
            const data = await response.json();
            setProduct(data)
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    }

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

    const fetchchartdat = async () => {
        const response = await fetch('http://localhost:3000/monthly-summary', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token":authtoken
            }
        })
        const data = await response.json();
        setChartdata(data)
    }

    useEffect(() => {
        fetchProducts()
        fetchorder()
        fetchusers()
        fetchchartdat()
    }, [])
    return (
        <AdminContext.Provider value={{ product, order, user,chartdata }}>
            {children}
        </AdminContext.Provider>
    )
}