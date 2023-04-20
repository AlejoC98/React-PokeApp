import { Box, Typography } from '@mui/material'
import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';

const BreadCrumb = ({ name = '' }) => {

    const urlPath = window.location.pathname.split('/');

    return (
        <Box display='block' width='100%'>
            <Breadcrumbs aria-label='BreadCrumb'>
                { urlPath.map((param, index) => (
                    <Typography key={index} sx={{ display: 'flex'}}>{ param === '' ? <HomeIcon fontSize="small" /> : param.replace(/%20/g, ' ') }</Typography>
                ))}
            </Breadcrumbs>
        </Box>
    )
}

export default BreadCrumb
