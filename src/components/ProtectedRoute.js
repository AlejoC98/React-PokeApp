// import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = UserAuth();
    
    if (user.email) {
        return children;
    } else {
        return (
            <Navigate to='/Login' />
        )
    }
}

const ProtectedLoggedRoute = ({ children }) => {
    const { user } = UserAuth();
    
    try {
        if (user.email) {
            return (
                <Navigate to='/Dashboard' />
            )
        } else {
            return children;
        }
        
    } catch (error) {
        if (user === null) {
            return children;
        } else {
            return (
                <Navigate to='/Dashboard' />
            )
        }
    }

}

export { ProtectedRoute, ProtectedLoggedRoute };
