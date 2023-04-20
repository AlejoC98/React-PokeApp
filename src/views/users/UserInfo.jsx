import { Avatar, Box, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import { GridItem } from '../../theme'
import { useLocation } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UserInfo = () => {

    const location = useLocation();

    const userData = location.state.data;

  return (
    <Grid container spacing={3}>
        <Grid item md={12}>
            <GridItem>
                <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'center'}}>
                    <Grid item md={3}>
                        <Avatar 
                            src={userData.profile}
                            alt={userData.name}
                            sx={{
                                height: 100,
                                width: 100
                            }}
                        />
                    </Grid>
                    <Grid item md={9} sx={{ display: 'flex', justifyContent: 'space-between'}}>
                        <Box textAlign='center'>
                            <Typography variant='h3'>
                                { userData.firstname } { userData.lastname }
                            </Typography>
                            <Typography>
                                Contact: { userData.email }
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton color='secondary' size='large'>
                                <PersonAddIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>
            </GridItem>
        </Grid>
    </Grid>
  )
}

export default UserInfo