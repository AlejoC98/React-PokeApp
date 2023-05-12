import React, { useEffect, useState } from 'react'
import { getUserFriends } from '../../context/FirebaseContext'
import { UserAuth } from '../../context/AuthContext';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import { GridItem } from '../../theme';
import { useNavigate } from 'react-router-dom';

const Friends = () => {

    const { user } = UserAuth();
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getUserFriends(user).then((res) => {
            if (res !== undefined)
                setFriends(res);
        }).catch((err) => {
            console.log(err);
        });
    }, [user]);

    const handleOpenUser = (user) => {
        navigate(`/Dashboard/${user.id}`, {state: {data: user}});
    }

  return (
    <Grid container spacing={3}>
        { friends.length > 0 ? (
            <Grid item xs={12} sm={12} md={12} sx={{ marginBottom: 2.2}}>
                <GridItem>
                    <Typography variant='h2'>
                        Friends
                    </Typography>
                    <Box mt={2}>
                        { friends.map(fri => (
                            <Box key={fri.id} display='flex' flexDirection='column' alignItems='center' position='relative' justifyContent='center' p={1} width={150} height={160} onClick={() => handleOpenUser(fri)} sx={{
                                '&:hover .hoverEff': {
                                    display: 'flex'
                                }
                            }}>
                                <Box className='hoverEff' />
                                <Avatar 
                                    src={fri.profile}
                                    alt={`${fri.firstname} ${fri.lastname}`}
                                    sx={{
                                        width: 130,
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
        ) : (
            <Grid item xs={12} sm={12} md={12}>
                <GridItem sx={{ textAlign: 'center'}}>
                    <Typography variant='h2'>You don't have friends yet!</Typography>
                </GridItem>
            </Grid>
        )}
    </Grid>
  )
}

export default Friends