import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { queryCollection, sendFriendRequest, updateCollection, createUserNotifications, deleteCollection } from '../../context/FirebaseContext';
import { UserAuth } from '../../context/AuthContext';
import UserInformation from '../../components/UserInformation';
import MyAccount from '../../components/MyAccount';


const UserInfo = () => {

    const location = useLocation();
    const { user } = UserAuth();
    const [friendStatus, setFriendStatus] = useState();
    const [userData, setUserData] = useState();
    const [alert, setAlert] = useState({});

    useEffect(() => {
        if ('data' in location.state) {
            setUserData(location.state.data);
        } else {
            queryCollection('users', [
                { field: 'id', operator: '==', value: location.state.link },
            ]).then((res) => {
                setUserData(res);
            }).catch((err) => {
                setAlert({
                    status: 'warning',
                    message: err.message
                });
            });
        }
    }, [location.state]);

    useEffect(() => {
        if (userData !== undefined) {
            queryCollection('user_friends',
                [
                    { field: 'user', operator: 'in', value: [user.email, userData.email] },
                    { field: 'friend', operator: 'in', value: [user.email, userData.email] }
                ]
            ).then((res) => {
                if (res !== undefined)
                    setFriendStatus(res);
            }).catch((err) => {
                setAlert({
                    status: 'warning',
                    message: err.message
                });
            });
        }
    }, [userData, user]);

    if (friendStatus !== undefined)
        return (
            <Box>
                { user.id !== location.state.link && friendStatus.status === false ? (
                    <UserInformation friendStatus={friendStatus} setFriendStatus={setFriendStatus} userData={userData} location={location} />
                ) : (
                    <MyAccount />
                )}
            </Box>
        )
}

export default UserInfo