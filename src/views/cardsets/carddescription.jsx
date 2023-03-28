import { Box, Grid, Typography, useTheme } from '@mui/material'
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { tokens } from '../../theme';
import { GetCard } from '../../context/PokemonContext';

const CardDescription = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { card } = useParams();
    const [cardData, setCardData] = useState({});

    useEffect(() => {
        GetCard(card).then(res => {
            setCardData(res);
        });
    }, [card]);

    return (
        <Grid container spacing={3}>
                <Grid className='block' backgroundColor={ theme.palette.mode === 'dark' ? colors.spacecadet[500] : colors.gray[800]} item xs={4}>loca</Grid>
                <Grid className='block' backgroundColor={ theme.palette.mode === 'dark' ? colors.spacecadet[500] : colors.gray[800]} color='green' item xs={8}>Perroo</Grid>
            </Grid>
    )
}

export default CardDescription
