import React, { useEffect, useReducer } from 'react'
import { Box, Button, Grid, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { GridItem } from "../../theme";
import { useLocation, useNavigate } from "react-router-dom";
import CardsElements from "../../components/CardsElements";
import { SetUpGame } from '../../context/PokemonContext';

function reducer(state, action) {
    switch (action.type) {
        case 'flip_card':
            if (!state.found.find(f => f.find(g => g.key === action.ele.key))) {
                let res = (state.flipped.length > 1 ) ? [] : (action.ele !== undefined) ? [...state.flipped, action.ele] : [...state.flipped];
                return {
                    ...state,
                    flipped: res
                }
            }
            break;
        case 'found_matches':
            let current_player = state.playersList.find(p => p.name === state.playersList[state.turn].name);

            current_player['matches'] = ('matches' in current_player) ? current_player['matches'] + action.found : action.found;

            state.found.push(state.flipped);

            return {
                ...state,
                flipped: []
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
            let response = {
                currentRound: state.currentRound,
                winner: []
            }
            
            // (response.round < state.rounds) ? response.round + 1 : state.rounds;
            response.currentRound = (response.currentRound < state.rounds) ? response.currentRound + 1 : 'end';
            
            for (let player of state.playersList) {
                if (response['winner'].length < 1) {
                    response['winner'].push(player)
                } else {
                    response['winner'].forEach((p) => {
                        if (p.matches < player.matches) {
                            return [player];
                        } else if (p.matches === player.matches) {
                            return [...response['winner'], player];
                        }
                    });
                }
            }

            return {
                ...state,
                ...response
            }
        case 'new_game':
            return {
                ...state,
                cards: action.data,
                winner: [],
                turn: 0,
                found: []
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

    const Navigate = useNavigate();

    const [state, dispatch] = useReducer(reducer, {
        ...location.state.data,
        cards: location.state.cards,
        flipped: [],
        found: [],
        turn: 0,
        currentRound: 1,
        winner: []
    });

    useEffect(() => {
        if (state.flipped.length === 2) {
            if (state.flipped[0].id === state.flipped[1].id) {
                dispatch({type: 'found_matches', found: 1});
            } 
            else {
                setTimeout(() => {
                    dispatch({type: 'flip_card'});
                    setTimeout(() => {
                        dispatch({type: 'next_turn'});
                    }, 100);
                }, 1000);
            }
        } else if (state.found.length === state.matches) {
            dispatch({type: 'next_round'});
        }
    }, [state.flipped, state.found, state.matches]);

    // Function to start next game
    async function handleAfterGame() {
        if (state.currentRound === 'end') {
            Navigate('/Dashboard');
        } else {
            await SetUpGame(state.cardset, state.level, state.matches).then((res) => {
                dispatch({type: 'new_game', data: res});
            });
        }
    }

    return (
        <Box flexGrow={1}>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <GridItem>
                        <Box className='board'>
                            {/* <Box className={state.matches === state.found_matches ? 'end-game-view' : ''}> */}
                            <Box className={state.winner.length >= 1 ? 'end-game-view' : 'none'} display='flex' justifyContent='center' alignItems='center' flexDirection='column'>
                                {/* <Typography variant='h2'>{ (state.winner.length === 1) ? 'Winner' : 'Tied'}</Typography>
                                <Typography variant='h2'></Typography> */}
                                { state.winner.map((p, i) => (
                                    <Box textAlign='center' key={`payer-data-${i}`}>
                                        <Typography variant='h1'>{ (state.winner.length === 1 && state.playersList.length > 1) ? 'Winner' : state.playersList.length > 1 ? 'Tied' : 'Well Done'}</Typography>
                                        <Typography variant='h2'>{p.name}</Typography>
                                        <Typography variant='h4'>Matches Found {p.matches} out of {state.matches}</Typography>
                                        <Box mt={3}>
                                            <Button 
                                                variant='contained' 
                                                color={state.currentRound === 'end' ? 'danger' : 'warning'}
                                                sx={{ color: '#ffffff'}}
                                                onClick={handleAfterGame}
                                            >
                                                { (state.currentRound === 'end') ? 'Exit' : 'Next Round'}
                                            </Button>
                                        </Box>
                                    </Box>
                                    ))
                                }
                            </Box>
                            <Grid container spacing={2} alignItems='center'>
                                <Grid item md={3}>
                                    <PlainGridItem>
                                        <Typography variant="h4">Players : { state.playersList[state.turn].name }</Typography>
                                    </PlainGridItem>
                                </Grid>
                                <Grid item md={3}>
                                    <PlainGridItem>
                                        <Typography variant="h4">Matches: { state.found.length } / { state.matches} </Typography>
                                    </PlainGridItem>
                                </Grid>
                                <Grid item md={3}>
                                    <PlainGridItem>
                                        <Typography variant="h4">Rounds: { state.currentRound } / { state.rounds }</Typography>
                                    </PlainGridItem>
                                </Grid>
                                <Grid item md={3}>
                                    <PlainGridItem>
                                        <Button variant="contained">Exit</Button>
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
                                            <CardsElements 
                                                card={element} 
                                                active={state.flipped.find(c => c.key === index) !== undefined} found={
                                                    state.found.find(f => f.find(g => g.key === index))
                                                }
                                            />
                                        </Grid>
                                    )) }
                                </Grid>
                            )}
                        </Box>
                    </GridItem>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Game