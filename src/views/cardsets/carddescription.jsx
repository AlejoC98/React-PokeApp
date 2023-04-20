import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material'
import { useLocation, useParams } from 'react-router-dom';
import { GridItem, tokens } from '../../theme';
import { GetCard } from '../../context/PokemonContext';
import Paper from '@mui/material/Paper';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BreadCrumb from '../../components/BreadCrumb';
import { BallTriangle } from 'react-loader-spinner';

const CardDescription = () => {
    const { card } = useParams();
    const [cardData, setCardData] = useState({});
    const location = useLocation();
    const { pathname } = location;
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        setCardData({});
        let set = pathname.split('/')[2];
        set = set.replace(/%20/g , ' ');
        GetCard(set, card).then(res => {
            setCardData(res);
        });
    }, [card, pathname]);

    return (
        <Box>
            <Grid container spacing={3} mb={3}>
                <Grid item md={12}>
                    <GridItem>
                        <BreadCrumb />
                    </GridItem>
                </Grid>
            </Grid>
            { 'name' in cardData ? (
                <Grid container spacing={3} sx={{ paddingBottom: 2}}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <GridItem className='block' sx={{ perspective: 1000}}>
                        <Typography variant='h3'>
                            #{cardData.nationalPokedexNumbers} - { cardData.name }
                        </Typography>
                        <Box position='relative' width='100%' height='100%' display='flex' justifyContent='center'>
                            <img
                                className='display-card'
                                src={cardData.images.large}
                                alt={cardData.name}
                            />
                        </Box>
                    </GridItem>
                </Grid>
                { 'abilities' in cardData && <Grid item xs={12} sm={12} md={6} lg={9}>
                    <GridItem className='block'>
                        <Typography variant='h3'>Abilities</Typography>
                        <Grid container spacing={2}>
                            <Grid item md={12}>
                                <ListItem>
                                    <ListItemText>
                                        { cardData.abilities.map((ab, i) => (
                                            <List>
                                                <ListItem>
                                                    <ListItemText>
                                                        <Typography variant='h4'>Name:</Typography>
                                                        <Typography>{ ab.name }</Typography>
                                                    </ListItemText>
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText>
                                                        <Typography variant='h4'>Description:</Typography>
                                                        <Typography>{ ab.text }</Typography>
                                                    </ListItemText>
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText>
                                                        <Typography variant='h4'>Type:</Typography>
                                                        <Typography>{ ab.type }</Typography>
                                                    </ListItemText>
                                                </ListItem>
                                            </List>
                                        )) }
                                    </ListItemText>
                                </ListItem>
                            </Grid>
                        </Grid>
                    </GridItem>
                </Grid>}
                <Grid item md={6} lg={'abilities' in cardData ? 3 : 6}>
                    <GridItem className='block'>
                        <Grid container spacing={3}>
                            <Grid item md={12}>
                                <ListItem>
                                    <ListItemText>
                                        <Typography variant='h4'>Rarity:</Typography>
                                        <Typography>{cardData.rarity}</Typography>
                                    </ListItemText>
                                </ListItem>
                            </Grid>
                            <Grid item md={4}>
                                <ListItem>
                                    <ListItemText>
                                        <Typography variant='h4'>Type:</Typography>
                                        <Typography>{cardData.types.join(' / ')}</Typography>
                                    </ListItemText>
                                </ListItem>
                            </Grid>
                            <Grid item md={4}>
                                <ListItem>
                                    <ListItemText>
                                        <Typography variant='h4'>HP:</Typography>
                                        <Typography>{cardData.hp}</Typography>
                                    </ListItemText>
                                </ListItem>
                            </Grid>
                            <Grid item md={4}>
                                <ListItem>
                                    <ListItemText>
                                        <Typography variant='h4'>Level:</Typography>
                                        <Typography>{cardData.level}</Typography>
                                    </ListItemText>
                                </ListItem>
                            </Grid>
                            <Grid item md={12}>
                                <ListItem>
                                    <ListItemText>
                                        <Typography variant='h4'>Pokedex Description:</Typography>
                                        <Typography>{cardData.flavorText}</Typography>
                                    </ListItemText>
                                </ListItem>
                            </Grid>
                        </Grid>
                    </GridItem>
                </Grid>
                <Grid item md={'abilities' in cardData ? 6 : 12} lg={ 'abilities' in cardData ? 9 : 12}>
                    <GridItem className='block'>
                        <Typography variant='h3'>Attacks</Typography>
                        <Grid container spacing={3} mt={1}>
                            <Grid item md={12}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Cost</TableCell>
                                                <TableCell>Energy Cost</TableCell>
                                                <TableCell>Damage</TableCell>
                                                <TableCell>Description</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            { cardData.attacks.map((att, i) => (
                                                <TableRow key={`row-${i}`}>
                                                    <TableCell>
                                                        { att.name }
                                                    </TableCell>
                                                    <TableCell>
                                                        { att.cost[0] }
                                                    </TableCell>
                                                    <TableCell>
                                                        { att.convertedEnergyCost }
                                                    </TableCell>
                                                    <TableCell>
                                                        { att.damage }
                                                    </TableCell>
                                                    <TableCell>
                                                        { att.text }
                                                    </TableCell>
                                                </TableRow>
                                            )) }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item md={'resistances' in cardData ? 6 : 12}>
                                <ListItem sx={{ textAlign: 'center'}}>
                                    <ListItemText>
                                        <Typography variant='h4'>Weaknesses:</Typography>
                                        { cardData.weaknesses.map((weak, ind) => (
                                            <Box key={`weak-${ind}`} >
                                                <Typography>Type: {weak.type}</Typography>
                                                <Typography>Value: {weak.value}</Typography>
                                            </Box>
                                        )) }
                                    </ListItemText>
                                </ListItem>
                            </Grid>
                            
                            { 'resistances' in cardData && (
                                <Grid item md={6}>
                                    <ListItem sx={{ textAlign: 'center'}}>
                                        <ListItemText>
                                            <Typography variant='h4'>Resistances:</Typography>
                                            { cardData.resistances.map((resi, ind) => (
                                                <Box key={`resis-${ind}`} >
                                                    <Typography>Type: {resi.type}</Typography>
                                                    <Typography>Value: {resi.value}</Typography>
                                                </Box>
                                            )) }
                                        </ListItemText>
                                    </ListItem>
                                </Grid>
                            )}
                        </Grid>
                    </GridItem>
                </Grid>
                { Object.keys(cardData.tcgplayer.prices).length > 0 && (
                    <Grid item md={12}>
                        <GridItem className='block'>
                            <Typography variant='h2' sx={{ display: 'flex', alignItems: 'center'}}>
                            <StorefrontIcon sx={{ marginRight: 2, fontSize: 40}} />
                                Market Information
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} md={6} lg={4} className='center-content'>
                                    <Typography variant='h4'>Update At:</Typography>
                                    <Typography>{ cardData.tcgplayer.updatedAt }</Typography>
                                </Grid>                           
                                <Grid item xs={12} sm={12} md={6} lg={4} className='center-content'>
                                    <Typography variant='h4'>Prices</Typography>
                                    <TableContainer component={Paper} sx={{ mt: 1}}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Lowest</TableCell>
                                                    <TableCell>average</TableCell>
                                                    <TableCell>Market</TableCell>
                                                    <TableCell>Highest</TableCell>
                                                    <TableCell>Current</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow>
                                                    { Object.values('holofoil' in cardData.tcgplayer.prices ? cardData.tcgplayer.prices.holofoil : 'unlimitedHolofoil' in cardData.tcgplayer.prices ? cardData.tcgplayer.prices.unlimitedHolofoil : cardData.tcgplayer.prices.normal).map((price, ind) => (
                                                        <TableCell key={`price-${ind}`}>
                                                            ${ price }
                                                        </TableCell>
                                                    )) }
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={4} className='center-content'>
                                    <img 
                                        src='https://mp-assets.tcgplayer.com/img/TCGplayer-logo-primary@2x.png'
                                        alt='TCGPlayer'
                                        style={{
                                            width: '100%',
                                            maxWidth: 400
                                        }}
                                    />
                                    <Button 
                                        variant='contained' 
                                        href={cardData.tcgplayer.url} 
                                        target="_blank"
                                        sx={{ mt: 2}}
                                    >
                                        Check
                                    </Button>
                                </Grid> 
                            </Grid>
                        </GridItem>
                    </Grid>
                )}
            </Grid>
            ) : (
                <Box width='100%' height='100%' display='flex' justifyContent='center' alignItems='center'>
                    <BallTriangle
                        color={colors.caribbean[500]}
                    />
                </Box>
            )}
        </Box>
    )

}

export default CardDescription
