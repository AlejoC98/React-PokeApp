import { Grid } from '@mui/material'
import React from 'react'
import MetaIcon from '../static/images/meta.png'
import GoogleIcon from '../static/images/google.png'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { UserAuth } from '../context/AuthContext'

const PlainGridItem = styled(Paper)(({ theme }) => ({
    backgroundColor: 'transparent',
    boxShadow: 'none',
    padding: theme.spacing(1.1),
    textAlign: 'center',
    cursor: 'pointer',
    '&:hover': {
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.30), rgba(255, 255, 255, 0.30))',
        transform: 'scale(1.1)',
        transition: 'all 0.5s ease'
    }
}));

const SocialMediaButtons = () => {

    const { popUpProviderLogin } = UserAuth();

    function handleClick(provider) {
        popUpProviderLogin(provider);
    }

    return (
        <Grid container spacing={3} sx={{ mt: 1, mb: 1}}>
            <Grid item md={6}>
                <PlainGridItem onClick={() => handleClick('meta')}>
                    <img 
                        src={MetaIcon}
                        alt='Meta'
                        style={{ 
                            width: 30
                        }}
                    />
                </PlainGridItem>
            </Grid>
            <Grid item md={6}>
                <PlainGridItem onClick={() => handleClick('google')}>
                    <img 
                        src={GoogleIcon}
                        alt='Google'
                        style={{ 
                            width: 30
                        }}
                    />
                </PlainGridItem>
            </Grid>
        </Grid>
    )
}

export default SocialMediaButtons