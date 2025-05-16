import React, { useEffect, useRef, useState } from "react";
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import html2canvas from "html2canvas";
import { getTokenWithExpiry } from "../../../utils/auth";


const OrderDetails = () => {
    const [order, setOrder] = useState(null);
    const pdfref = useRef()
    const location = useLocation();
    const id = location.state?.id;

    const token = getTokenWithExpiry('token');


    const fetchOrder = async () => {
        try {
            const response = await fetch(`http://localhost:3000/orderdetails/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }

            const data = await response.json();
            setOrder(data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };


    useEffect(() => {

        fetchOrder();
    }, [id, token]);

    const itemReturn = async (e) => {
        e.preventDefault()
        const final = confirm("Du You Want To Retrn This Product ? ")
        if (!final) {
            return
        }
        const response = await fetch('http://localhost:3000/refund', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            },
            body: JSON.stringify({ captureid: order.captureid })
        })
        const itemstatus = await response.json()
        console.log(itemstatus)
        const update = await fetch(`http://localhost:3000/updateorder/${order._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'access-token': token
            },
            body: JSON.stringify({ refundid: itemstatus.id })
        })
        const data = await update.json()
        console.log(data)
        await fetchOrder()
    }

    const handlepdfdownload = (e) => {
        e.preventDefault()
        const element = pdfref.current
        const opt = {
            margin: 0.5,
            filename: `Order-${order.orderID}.pdf`,
            image: { 'type': '.jpeg', 'quality': 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }

        }
        html2pdf().set(opt).from(element).save()
    }

    if (!order) {
        return <div className="text-center mt-5">Loading order details...</div>;
    }

    return (
        <div style={{ backgroundColor: 'rgb(234, 238, 244)' }}>
            <div className="container text-end mt-2">
                Download Invoices
                <i className="fa-solid fa-file-arrow-down mx-2  fa-xl" onClick={handlepdfdownload} style={{ color: '#74C0FC' }}></i></div>
            <div ref={pdfref} className='container mt-3 p-4 border border-success rounded shadow' style={{backgroundColor:'#f5f7fa'}}>
                <h3 className="text-success mb-3 text-center">Order Details</h3>

                <hr />
                {order.refundid && <p style={{ color: 'red' }}><strong><em>Order Returned Successfully. </em></strong></p>}
                <p><strong>🆔 Order ID:</strong> {order.orderID}</p>
                <p><strong>🆔 Payment ID:</strong> {order.paymentid}</p>
                <p><strong>📅 Date:</strong> {new Date(order.paymentdate).toLocaleDateString()}</p>
                {order.refundid ? <p><strong>💳 Refund Status:</strong> <span className="text-success">{order.paymentstatus}</span></p> : <p><strong>💳 Status:</strong> <span className="text-success">{order.paymentstatus}</span></p>}
                <p><strong>💰 Total Paid:</strong> ${(parseFloat(order.totalprice)).toFixed(2)} {order.refundid && '( Refunded )'}</p>

                {order.address && (
                    <div className="mt-4">
                        <h5>📍 Shipping Details:</h5>
                        <p><strong>Name:</strong> {order.address.name}</p>
                        <p><strong>Phone:</strong> {order.address.number}</p>
                        <p><strong>Address:</strong> {`${order.address.address + ","}  ${order.address.locality && order.address.locality + ","}`} {order.address.city}, {order.address.state} - {order.address.pincode}</p>
                        {order.address.landmark && <p><strong>Landmark:</strong> {order.address.landmark}</p>}
                    </div>
                )}
                <h5 className="mt-4">🛍️ Ordered Products:</h5>
                <table className="table table-bordered mt-2">
                    <thead className="table-success">
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.products.map((item, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{item.productname}</td>
                                <td>${item.prize}</td>
                                <td>{item.quantity}</td>
                            </tr>
                        ))}
                        <tr>
                            {!order.refundid && (() => {
                                const orderDate = new Date(order.paymentdate);
                                console.log(orderDate)
                                const currentDate = new Date();
                                console.log(currentDate)
                                const diffTime = currentDate - orderDate;
                                console.log(diffTime)
                                const diffDays = diffTime / (1000 * 60 * 60 * 24);
                                console.log(diffDays)

                                if (diffDays <= 7) {
                                    return (

                                        <td className="text-center" colSpan={4}>
                                            <button className="btn btn-success text-center" onClick={itemReturn} type="button">
                                                RETURN
                                            </button>
                                        </td>

                                    );
                                } else {
                                    return (

                                        <td className="text-center text-danger" colSpan={4}>
                                            Return window closed
                                        </td>

                                    );
                                }
                            })()}

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderDetails;
