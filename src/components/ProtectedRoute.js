import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = UserAuth();
    const location = useLocation();
    console.log(location);
    return (
        user.email ? <Outlet/> : <Navigate to="/Login" />
    )
}

export default ProtectedRoute
