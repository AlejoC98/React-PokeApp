import { Box, Button, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GridItem } from '../../theme';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import pokecard from '../../static/images/pokecard.png'
import { SetUpGame } from '../../context/PokemonContext';
import { useLocation } from 'react-router-dom';

const PlainGridItem = styled(Paper)(({ theme }) => ({
    backgroundColor: 'transparent',
    boxShadow: 'none',
    backgroundImage: 'none',
    padding: theme.spacing(0),
}));

const Game = () => {

    const location = useLocation();

    const gameData = location.state.data;

    const [cards, setCards] = useState([]);

    const [currentTurn, setCurrentTurn] = useState(gameData.playersList[0].name);

    const [matchesFound, setMatchesFound] = useState([]);

    // Setting up game once got data
    useEffect(() => {
        SetUpGame(gameData.cardset, gameData.level, gameData.matches).then((res) => {
            setCards(res);
        });
    }, [gameData]);

    const CardElements = () => {
        
        let cardsResponse = [];

        const [flip, setFlip] = useState([]);
        
        function handleClick(props) {
            if (flip.length < 2)
                setFlip([...flip, props]);
        }

        useEffect(() => {
            if (flip.length === 2) {
                if (flip.every((val, i, arr) => arr.filter(mc => mc.id === val.id).length === 2)) {
                    setMatchesFound(m => [...m, flip[0]]);
                }
                setTimeout(() => {
                    setFlip([]);
                    let currentPlayerIndex = gameData.playersList.indexOf(gameData.playersList.find(p => p.name === currentTurn));
                    (currentPlayerIndex < gameData.playersList.length -1) ? setCurrentTurn(gameData.playersList[currentPlayerIndex + 1].name) : setCurrentTurn(gameData.playersList[0].name);
                }, 1000);
            }

        }, [flip])

        cards.forEach((element, index) => {
            cardsResponse.push(
                <Grid item key={`card-${index}`} onClick={() => handleClick({key: `card-${index}`, id: element.id})}>
                    <PlainGridItem sx={{ height: { xs: 80, sm: 80, md: 140}, width: { xs: 58, sm: 58, md: 100} }} className='CardContainer'>
                       <Box className='PokeCard' sx={ flip.find(c => c.key === `card-${index}`) ? { transform: 'rotateY(180deg)' } : matchesFound.find(mf => mf.id === element.id) ? { transform: 'rotateY(180deg)' } : { transform: 'rotateY(0deg)' }} id={element.id}>
                            <Box className='found' sx={ matchesFound.find(mf => mf.id === element.id) ? { display: 'flex'} : { display: 'none' } }></Box>
                            <Box className='front'>
                                <img src={pokecard} alt="poce" style={{ width: '100%', height: '100%'}} />
                            </Box>
                            <Box className='back'>
                                <img src={element.images ? element.images.small : 'paila'} alt="poce" style={{ width: '100%', height: '100%'}} />
                            </Box>
                       </Box>
                    </PlainGridItem>
                </Grid>
            );
        });

        return cardsResponse;
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <GridItem>
                    <Box sx={{ backgroundImage: `url(https://wallpapercave.com/wp/wp2711089.png)`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center bottom', padding: 3}}>
                        <Grid container spacing={3} alignItems='center'>
                            <Grid item xs={12} md={3}>
                                <PlainGridItem>
                                    <Typography variant='h4' color='danger'>
                                        { currentTurn }
                                    </Typography>
                                </PlainGridItem>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <PlainGridItem>
                                    <Typography variant='h4' color='danger'>
                                        { `Matches ${matchesFound.length} / ${gameData.matches}` }
                                    </Typography>
                                </PlainGridItem>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <PlainGridItem>
                                    <Typography variant='h4' color='danger'>
                                        Rounds: 0 / 0
                                    </Typography>
                                </PlainGridItem>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <PlainGridItem>
                                    <Button variant='contained'>Exit</Button>
                                </PlainGridItem>
                            </Grid>
                        </Grid>
                        <Grid container spacing={{ xs: 2, sm: 2, md: 4, lg: 6}} justifyContent='center' 
                            style={{ marginTop: 10}}
                        >
                            <CardElements count={20} />
                        </Grid>
                    </Box>
                </GridItem>
            </Grid>
        </Grid>
    )
}

export default Game