import { Avatar, Box, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { GridItem, PlainGridItem } from '../theme'
import { useLocation } from 'react-router-dom';
import { queryCollection, updateCollection, updateFavorites, uploadFiles } from '../context/FirebaseContext';
import DisplayItems from './DisplayItems';
import Notification from './Notification';
import CreateIcon from '@mui/icons-material/Create';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { UserAuth } from '../context/AuthContext';

const MyAccount = () => {

    const { user } = UserAuth();
    const { setContextProfile } = UserAuth();
    const location = useLocation();
    const [userData, setUserData] = useState();
    const [alert, setAlert] = useState({});
    const [favorites, setFavorites] = useState([]);
    const [imageUpload, setImageUpload] = useState();
    const fileInput = useRef();

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
        const searchData = JSON.parse(localStorage.getItem('searchData'));
        const check_user = userData === undefined ? location.state.data : userData;
        updateFavorites([], check_user).then((res) => {
            if (res !== undefined) {
                const data = [];
                res.forEach((fav) => {
                    let ser_fav = searchData.find(se => se.id === fav);
                    if (ser_fav !== undefined) {
                        // const {profile: _, ...insert} = { ['images']: {small : ser_fav.profile}, ...ser_fav }
                        // data.push(insert);
                        data.push(ser_fav);
                    }
                });
                setFavorites(data);
            }
        }).catch((err) => {
            setAlert({
                status: 'warning',
                message: err.message
            });
        });
    }, [userData, location.state]);

    const handleUploadImage = (fileInput) => {
        const image = fileInput.target.files[0];
        const reader = new FileReader();

        reader.onloadend = async() => {
            setImageUpload(reader.result);
            await uploadFiles(image).then(async(newUrl) => {
                if (newUrl !== undefined)
                    await updateCollection('users', userData.record_id, {profile: newUrl});
                    await setContextProfile({photoURL : newUrl});
            }).catch((err) => {
                setAlert({
                    status: 'warning',
                    message: err.message
                });
            });
        }

        if (image) {
            reader.readAsDataURL(image);
        } else {
            setImageUpload(null);
        }
    };

    if (userData !== undefined) {
        return (
          <Grid container spacing={3}>
            <Notification status={alert.status} message={alert.message} />
            {/* Player Information */}
              <Grid item xs={12} sm={12} md={4} lg={2}>
                  <GridItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center','&:hover .hoverEff': {display: 'flex'}}} className='block'>
                    { userData.id === location.state.link && (
                        <Box className='hoverEff' justifyContent='center' alignItems='center' sx={{ cursor: 'default'}}>
                            <IconButton color='info' sx={{ zIndex: 1100}} aria-label="upload picture" component="label">
                                <input hidden accept="image/*" type="file" ref={fileInput} onChange={handleUploadImage} />
                                <PhotoCamera style={{ fontSize: 47}} />
                            </IconButton>
                        </Box>
                    )}
                    <Avatar
                        src={ imageUpload ? imageUpload : userData.profile}
                        alt={userData.name}
                        sx={{
                            maxHeight: '90%',
                            minHeight: '90%',
                            maxWidth: '100%',
                            minWidth: '100%',
                        }}
                    />
                  </GridItem>
              </Grid>
              <Grid item xs={12} sm={12} md={8} lg={10}>
                  <GridItem className='block'>
                    <Typography variant='h2'> My Account</Typography>
                    <Grid container spacing={3} >
                        <Grid item md={6} sx={{ textAlign: 'center'}}>
                          <PlainGridItem sx={{ backgroundImage: 'none'}}>
                            <Typography variant='h4'>
                                Firstname:
                            </Typography>
                            <Typography sx={{
                                '&:hover button': {
                                    display: 'inline-flex'
                                }
                            }}>
                                { userData.firstname }
                                { userData.id === location.state.link && (
                                    <IconButton sx={{ 
                                        display: 'none'
                                    }}>
                                        <CreateIcon />
                                    </IconButton>
                                ) }
                            </Typography>
                          </PlainGridItem>
                          <PlainGridItem sx={{ backgroundImage: 'none'}}>
                            <Typography variant='h4'>
                                Lastname:
                            </Typography>
                            <Typography sx={{
                                '&:hover button': {
                                    display: 'inline-flex'
                                }
                            }}>
                                { userData.lastname }
                                { userData.id === location.state.link && (
                                    <IconButton sx={{ 
                                        display: 'none'
                                    }}>
                                        <CreateIcon />
                                    </IconButton>
                                ) }
                            </Typography>
                          </PlainGridItem>
                          <PlainGridItem sx={{ backgroundImage: 'none'}}>
                            <Typography variant='h4'>
                                Email:
                            </Typography>
                            <Typography sx={{
                                '&:hover button': {
                                    display: 'inline-flex'
                                }
                            }}>
                                { userData.email }
                                { userData.id === location.state.link && (
                                    <IconButton sx={{ 
                                        display: 'none'
                                    }}>
                                        <CreateIcon />
                                    </IconButton>
                                ) }
                            </Typography>
                          </PlainGridItem>
                        </Grid>

                        { user.email === userData.email && (
                            <Grid item md={6} sx={{ textAlign: 'center'}}>
                            <PlainGridItem sx={{ backgroundImage: 'none'}}>
                                <Typography variant='h4'>
                                    Account Created:
                                </Typography>
                                { user.createdAt }
                            </PlainGridItem>
                            {/* <PlainGridItem sx={{ backgroundImage: 'none'}}>
                                <Typography variant='h4'>
                                    Times Played:
                                </Typography>
                                { user.lastLogin }
                            </PlainGridItem> */}
                            </Grid>
                        )}
                    </Grid>
                  </GridItem>
              </Grid>
              {/* Trophies */}
              <Grid item xs={12} sm={12} md={12}>
                <GridItem className='block'>
                    <Typography variant='h2'>
                        Trophies
                    </Typography>
                </GridItem>
              </Grid>
              {/* Favorites */}
              { favorites.length > 0 && (
                <Grid item md={12}>
                    <GridItem>
                        <Typography variant='h2' sx={{ position: 'absolute'}}>
                            Favorites
                        </Typography>
                        <DisplayItems data={favorites} breadcrumb={false}/>
                    </GridItem>
                </Grid>
              )}
              {/* Friends */}
          </Grid>
        )
    }
}

export default MyAccount