import React, { useEffect, useState } from 'react'
import { Grid, ListItem, ListItemText, Typography } from '@mui/material'
import { useParams } from 'react-router-dom';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
import { GridItem } from '../../theme';
import { GetCard } from '../../context/PokemonContext';
import { width } from '@mui/system';

const CardDescription = () => {
    const { card } = useParams();
    const [cardData, setCardData] = useState({});

    useEffect(() => {
        GetCard(card).then(res => {
            setCardData(res);
        });
    }, [card]);

    console.log(cardData);

    if ('name' in cardData) {
        return (
            <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <GridItem>
                            <Typography sx={{ fontSize: { sm: 'h1'}}}>#{cardData.nationalPokedexNumbers} - { cardData.name}</Typography>
                            <img 
                                src={cardData.images.large}
                                alt={cardData.name}
                                style={{
                                    maxHeight: 300,
                                    width: '10%'
                                }}
                            />
                        </GridItem>
                    </Grid>
                    <Grid item xs={12} sm={12} md={9} lg={9}>
                        <GridItem>
                        <Grid container spacing={2}>
                            <Grid item>
                                <ListItem>
                                    <ListItemText>
                                        <Typography>Pokedex Description:</Typography>
                                        <Typography>{cardData.flavorText}</Typography>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <Typography>Type:</Typography>
                                        <Typography>{cardData.types.join(' / ')}</Typography>
                                    </ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemText>
                                        <Typography>Weaknesses:</Typography>
                                        <Typography>{cardData.weaknesses[0].type}</Typography>
                                    </ListItemText>
                                </ListItem>
                            </Grid>
                        </Grid>
                        </GridItem>
                    </Grid>
                </Grid>
        )
    }

}

export default CardDescription
