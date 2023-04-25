import { Avatar, Box, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GridItem, PlainGridItem } from '../theme'
import { useLocation } from 'react-router-dom';
import { getUserFriends, queryCollection, updateFavorites } from '../context/FirebaseContext';
import DisplayItems from './DisplayItems';

const MyAccount = () => {

    const location = useLocation();
    const [userData, setUserData] = useState();
    const [friends, setFriends] = useState([]);
    const [alert, setAlert] = useState({});
    const [favorites, setFavorites] = useState([]);

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
                        const {profile: _, ...insert} = { ['images']: {small : ser_fav.profile}, ...ser_fav }
                        data.push(insert);
                    }
                });
                setFavorites(data);
            }
        }).catch((err) => {
            console.log(err);
        });

        getUserFriends(check_user).then((res) => {
            if (res !== undefined)
                setFriends(res);
        }).catch((err) => {
            console.log(err);
        })
    }, [userData]);

    if (userData !== undefined) {
        return (
          <Grid container spacing={3}>
            {/* Player Information */}
              <Grid item md={2}>
                  <GridItem sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}} className='block'>
                      <Avatar
                          src={userData.profile}
                          alt={userData.name}
                          sx={{
                              height: '90%',
                              width: '100%'
                          }}
                      />
                  </GridItem>
              </Grid>
              <Grid item md={10}>
                  <GridItem className='block'>
                    <Typography variant='h2'> My Account</Typography>
                    <Grid container spacing={3} >
                        <Grid item md={6} sx={{ textAlign: 'center'}}>
                          <PlainGridItem sx={{ backgroundImage: 'none'}}>
                            <Typography variant='h4'>
                                Firstname:
                            </Typography>
                            { userData.firstname }
                          </PlainGridItem>
                          <PlainGridItem sx={{ backgroundImage: 'none'}}>
                            <Typography variant='h4'>
                                Lastname:
                            </Typography>
                            { userData.lastname }
                          </PlainGridItem>
                          <PlainGridItem sx={{ backgroundImage: 'none'}}>
                            <Typography variant='h4'>
                                Email:
                            </Typography>
                            { userData.email }
                          </PlainGridItem>
                        </Grid>
                        <Grid item md={6} sx={{ textAlign: 'center'}}>
                          <PlainGridItem sx={{ backgroundImage: 'none'}}>
                            <Typography variant='h4'>
                                Account Created:
                            </Typography>
                            { userData.firstname }
                          </PlainGridItem>
                          <PlainGridItem sx={{ backgroundImage: 'none'}}>
                            <Typography variant='h4'>
                                Times Played:
                            </Typography>
                            { userData.lastname }
                          </PlainGridItem>
                        </Grid>
                    </Grid>
                  </GridItem>
              </Grid>
              {/* Trophies */}
              <Grid item md={12}>
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
              { friends.length > 0 && (
                <Grid item md={12} sx={{ marginBottom: 2.2}}>
                    <GridItem className='block'>
                        <Typography variant='h2'>
                            Friends
                        </Typography>
                        <Box>
                            { friends.map(fri => (
                                <Box key={fri.id} display='flex' flexDirection='column' alignItems='center'>
                                    <Avatar 
                                        src={fri.profile}
                                        alt={`${fri.firstname} ${fri.lastname}`}
                                        sx={{
                                            width: '100%',
                                            height: 130
                                        }}
                                    />
                                    <Typography>
                                        { fri.firstname } { fri.lastname }
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </GridItem>
                </Grid>
              )}
          </Grid>
        )
    }
}

export default MyAccount