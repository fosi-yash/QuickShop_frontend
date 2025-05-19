import React, { useEffect } from 'react'
import DashboardChart from './DashboardChart'
import { useNavigate } from 'react-router';
import { getTokenWithExpiry } from '../../../utils/auth';


const Dashboard = () => {
  const navigate = useNavigate()
  const token = getTokenWithExpiry('token');
  const role = getTokenWithExpiry('role')
  useEffect(() => {

    if (role !== 'admin' || !token) {
      return navigate('/login')
    }
  })

  return (

    <div className=" p-6" style={{ backgroundColor: '#eaeef4' }}>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <DashboardChart />
    </div>

  )
}

export default Dashboard
