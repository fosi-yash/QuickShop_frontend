import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTokenWithExpiry } from '../../../utils/auth'

const Orders = () => {
   const [orders,setOrders]=useState([])
   const token =getTokenWithExpiry('token')
   const navigate=useNavigate()

   useEffect(()=>{
    async function fetchorders(){
        const response=await fetch('http://localhost:3000/userorders',{
           method:'GET',
           headers:{

               'Content-Type':'application/json',
               "auth-token":token
            }
        })
        const data=await response.json()
        setOrders(data)
    } 
    fetchorders()
   },[])
    return (
   



        <div className=" " style={{backgroundColor:'#eaeef4',minHeight:'100vh'}}>
        <div className=" container shadow mt-2 order-list">
          <h2 className="mb-4">Your Orders</h2>
          {orders.length === 0 ? (
            <p className="text-muted">No orders found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Order ID</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((item, index) => (
                    <tr key={index + 1}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.orderID}</td>
                      <td>{new Date(item.paymentdate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${item.refundid && 'text-danger  '}  bg-${item.refundid? 'warning ':(item.paymentstatus === 'COMPLETED' ? 'success' : 'warning')}`}>
                          { item.refundid ? "RETURNED" :item.paymentstatus}
                        </span>
                      </td>
                      <td>
                        <button onClick={()=>{navigate('/orderdetails',{state:{id:item._id}})}} className="btn w-75 btn-sm btn-secondary" >View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
    )
}

export default Orders
