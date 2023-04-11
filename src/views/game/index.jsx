import React, { useEffect, useReducer } from 'react'
import { Box, Button, Grid, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { GridItem } from "../../theme";
import { useLocation } from "react-router-dom";
import CardsElements from "../../components/CardsElements";

function reducer(state, action) {
    switch (action.type) {
        case 'increase':
            return {
                ...state,
                players: state.players + 1
            }
        case 'flip_card':
            let res = (state.flipped.length > 1 ) ? [] : (action.ele !== undefined) ? [...state.flipped, action.ele] : [...state.flipped];
            return {
                ...state,
                flipped: res
            }
        case 'found_matches':
            return {
                ...state,
                found: [...state.found, ...action.matches],
                found_matches: action.matches.length / 2,
            }
        case 'next_turn':
            let turn = state.turn;
            let players = (state.playersList.length - 1);
            if (state.turn < players) {
                turn += 1;
            } else if (state.turn === players) {
                turn = 0;
            }
            return {
                ...state,
                turn: turn
            }
        case 'next_round':
            let round = state.currentRound;
            if (round < state.rounds)
                round += 1;
            
            return {
                ...state,
                currentRound: round
            }
        default:
            throw Error('Unknown action puto.');
    }
}

const PlainGridItem = styled(Paper)(({ theme }) => ({
    backgroundColor: 'transparent',
    boxShadow: 'none',
    padding: theme.spacing(0.5),
    textAlign: 'center'
}));

const Game = () => {

    const location = useLocation();

    const [state, dispatch] = useReducer(reducer, {
        ...location.state.data,
        cards: location.state.cards,
        flipped: [],
        found: [],
        found_matches: 0,
        turn: 0,
        currentRound: 1
    });

    useEffect(() => {
        if (state.flipped.length === 2) {
            if (state.flipped[0].id === state.flipped[1].id) {
                dispatch({type: 'found_matches', matches: [state.flipped[0].key, state.flipped[1].key]});
            } else {
                setTimeout(() => {
                    dispatch({type: 'flip_card'});
                }, 1000);
            }
            dispatch({type: 'next_turn'});
        }
    }, [state.flipped]);

    useEffect(() => {
        if (state.matches === state.found_matches) {
            dispatch({type: 'next_round'});
        }
    }, [state.found_matches, state.matches]);

    return (
        <Box>
            <Box flexGrow={1}>
                <Grid container spacing={2}>
                    <Grid item md={12}>
                        <GridItem>
                            <Box className='board'>
                                <Grid container spacing={2} alignItems='center'>
                                    <Grid item md={3}>
                                        <PlainGridItem>
                                            <Typography variant="h4">Players : { state.playersList[state.turn].name }</Typography>
                                        </PlainGridItem>
                                    </Grid>
                                    <Grid item md={3}>
                                        <PlainGridItem>
                                            <Typography variant="h4">Matches: { state.found_matches } / { state.matches} </Typography>
                                        </PlainGridItem>
                                    </Grid>
                                    <Grid item md={3}>
                                        <PlainGridItem>
                                            <Typography variant="h4">Rounds: 0 / { state.rounds }</Typography>
                                        </PlainGridItem>
                                    </Grid>
                                    <Grid item md={3}>
                                        <PlainGridItem>
                                            <Button color="danger" variant="contained">Exit</Button>
                                        </PlainGridItem>
                                    </Grid>
                                </Grid>

                                { (state.cards !== undefined &&
                                    <Grid container spacing={2} mt={5} justifyContent='center'>
                                        { state.cards.map((element, index) => (
                                            <Grid 
                                                item 
                                                md={2} 
                                                key={`card-${index}`} 
                                                sx={{ 
                                                    textAlign: 'center',
                                                    position: 'relative'
                                                }} 
                                                onClick={() => 
                                                    dispatch({type: 'flip_card', ele: { id: element.id, key: index}})
                                                }
                                            >
                                                <CardsElements card={element} active={state.flipped.find(c => c.key === index) !== undefined} found={state.found.includes(index)}/>
                                            </Grid>
                                        )) }
                                    </Grid>
                                )}
                            </Box>
                        </GridItem>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default Game