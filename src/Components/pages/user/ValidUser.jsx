import React from 'react'
import { Navigate } from 'react-router-dom'
import { getTokenWithExpiry } from '../../../utils/auth'

const ValidUser = ({children}) => {
    const token=getTokenWithExpiry('token')
    return token?children:<Navigate to='/login'/>
}

export default ValidUser
