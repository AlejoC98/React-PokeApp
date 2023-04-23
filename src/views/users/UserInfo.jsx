import { Avatar, Box, Button, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GridItem } from '../../theme'
import { useLocation } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { queryCollection, sendFriendRequest, updateCollection, createUserNotifications, deleteCollection } from '../../context/FirebaseContext';
import Notification from '../../components/Notification';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { UserAuth } from '../../context/AuthContext';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';

const UserInfo = () => {

    const location = useLocation();
    const [userData, setUserData] = useState();
    const { user } = UserAuth();
    const [friendStatus, setFriendStatus] = useState(false);
    const [sentRquest, setSentRequest] = useState({});

    useEffect(() => {
        if ('data' in location.state){
            setUserData(location.state.data);
        } else {
            queryCollection('users', [
                {field: 'id', operator: '==', value: location.state.link},
            ]).then((res) => {
                setUserData(res);
            }).catch((err) => {
                setSentRequest({
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
                {field: 'user', operator: 'in', value: [user.email, userData.email]},
                {field: 'friend', operator: 'in', value: [user.email, userData.email]}
            ]
        ).then((res) => {
            if (res !== undefined)
                setFriendStatus(res);
        }).catch((err) => {
            setSentRequest({
                status: 'warning',
                message: err.message
            });
        });
        }
    }, [userData, user]);

    const handleAcceptRequest = () => {
        updateCollection('user_friends', friendStatus.record_id, { status: true}).then((res) => {
            if (res) {
                setFriendStatus({
                    ...friendStatus,
                    status: true
                });

                queryCollection('users', [{field: 'email', operator: '==', value: user.email}]).then((userres) => {
                    createUserNotifications({user: friendStatus.user, title: `Request Accepted`, text: `${user.displayName} has accepted your friendship request!`, link: userres.id, status: false});
                }).catch((err) => {
                    console.log(err);
                });
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleRejectRequest = () => {
        deleteCollection('user_friends', friendStatus.record_id).then((res) => {
            deleteCollection('user_notifications', location.state.record_id).then((res) => {
                if (res)
                    setFriendStatus(false);
            }).catch((err) => {
                console.log(err.message);
            })
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const handleAddFriend = () => {
        sendFriendRequest(userData).then((res) => {
            setSentRequest({
                status: 'success',
                message: res
            });
            setFriendStatus({
                status: false,
                user: user.email
            });
        }).catch((err) => {
            setSentRequest({
                status: 'warning',
                message: err.message
            });
        })
    }

    if ( userData !== undefined) {
        return (
          <Grid container spacing={3}>
              <Notification status={sentRquest.status} message={sentRquest.message} />
              <Grid item md={12}>
                  <GridItem>
                      <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <Grid item sm={12} md={3}>
                              <Avatar 
                                  src={userData.profile}
                                  alt={userData.name}
                                  sx={{
                                      height: 100,
                                      width: 100
                                  }}
                              />
                          </Grid>
                          <Grid item sm={12} md={9} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <Box textAlign='center'>
                                  <Typography variant='h3'>
                                      { userData.firstname } { userData.lastname }
                                  </Typography>
                                  <Typography>
                                      Contact: { userData.email }
                                  </Typography>
                              </Box>
                              <Box>
                                    { friendStatus.status === false ?
                                        (user.email === friendStatus.user) ? (
                                            <MarkEmailReadIcon />
                                        ) : (
                                            <Box display='flex' justifyContent='space-around' width={210}>
                                                <Button 
                                                    color='info' 
                                                    variant='contained' 
                                                    sx={{ color: '#fff'}} 
                                                    startIcon={<CheckIcon />}
                                                    onClick={handleAcceptRequest}
                                                >
                                                    Accept
                                                </Button>
                                                <Button 
                                                    color='danger' 
                                                    variant='contained' 
                                                    startIcon={< DeleteIcon />}
                                                    onClick={handleRejectRequest}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        )
                                 : friendStatus.status === true ? (
                                        <Typography variant='h4' sx={{ display: 'flex', alignItems: 'center', color: '#53b3cb', justifyContent: 'space-around', width: 100}}>
                                            <GroupIcon />
                                            Friends
                                        </Typography>
                                  ) : (
                                    <IconButton color='secondary' size='large' onClick={handleAddFriend}>
                                          <PersonAddIcon />
                                      </IconButton>
                                  )}
                              </Box>
                          </Grid>
                      </Grid>
                  </GridItem>
              </Grid>
          </Grid>
        )
    }

}

export default UserInfo