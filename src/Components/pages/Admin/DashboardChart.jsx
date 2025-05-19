import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAdmin } from './AdminContext';
import { useNavigate } from 'react-router';
import { getTokenWithExpiry } from '../../../utils/auth';

const DashboardChart = () => {

    const { product,order,user,chartdata } = useAdmin()

        const navigate=useNavigate()
    const token = getTokenWithExpiry('token');
         const role=getTokenWithExpiry('role')
            if(role!=='admin'  || !token){
               return navigate('/login')
            }

    return (
        <div className=" mx-2 mb-5 p-3 rounded shadow w-full " style={{ backgroundColor: '#f5f7fa' }}>
            <h2 className="text-lg  font-semibold mb-4">Monthly Orders & Revenue</h2>
            <div className="d-flex justify-content-between">
                <div style={{ width: '80%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartdata}
                            barSize={20}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis
                                yAxisId="left"
                                label={{ value: 'Orders', angle: -90, position: 'insideLeft' }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                label={{ value: 'revanue($)', angle: -90, position: 'insideRight' }}

                            />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="orders" fill="#3b82f6" />
                            <Bar yAxisId="right" dataKey="revenue" fill="#34d399" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className='text-center pe-5'>

                    <div className=" my-3 p-4 rounded" style={{ backgroundColor: 'red', color: 'white' }}>Total Users: {user.length}</div>
                    <div className=" my-3  p-4 rounded" style={{ backgroundColor: 'orange', color: 'white' }}>Total Products: {product.length}</div>
                    <div className=" my-3  p-4 rounded" style={{ backgroundColor: 'green', color: 'white' }}>Total Orders: {order.length}</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardChart;
