import React, { useEffect, useReducer } from 'react'
import { Box, Button, Grid, Typography } from "@mui/material";
// import { styled } from '@mui/material/styles';
// import Paper from '@mui/material/Paper';
import { GridItem, PlainGridItem } from "../../theme";
import { useLocation, useNavigate } from "react-router-dom";
import CardsElements from "../../components/CardsElements";
import { SetUpGame } from '../../context/PokemonContext';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function reducer(state, action) {
    switch (action.type) {
        case 'flip_card':
            let fli_res = {};
            if (state.flipped.find(fl => fl.key === action.ele.key) === undefined) {
                if ( state.found.find(p => p.find(m => m.key === action.ele.key)) === undefined ) {
                    let res = (state.flipped.length > 1 ) ? [] : (action.ele !== undefined && action.ele.key !== '') ? [...state.flipped, action.ele] : [...state.flipped];
                    fli_res = {
                        flipped: res
                    }
                }
            }           
            return {
                ...state,
                ...fli_res
            }
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
            }

            
            for (let player of state.playersList) {

                player['matches'] = ('matches' in player) ? player.matches : 0;

                state.results.top = (player.matches > state.results.top) ? player.matches : state.results.top;

                let data_player = state.results.data.find(p => p.name === player.name);

                if (data_player !== undefined ) {
                    data_player.matches.push(`Round ${state.currentRound}: ${player.matches} out of ${state.matches}`);
                    data_player.total += player.matches;
                } else {
                    let insert = {};

                    insert['matches'] = [`Round ${state.currentRound}: ${player.matches} out of ${state.matches}`]
                    insert['name'] = player.name
                    insert['total'] = player.matches;
                    
                    state.results.data.push(insert);
                }

            }
            
            response.currentRound = (response.currentRound < state.rounds) ? response.currentRound + 1 : 'end';

            // Ordering data by matches found
            state.results.data.sort((a, b) => {
                return b.total - a.total;
            });

            // getting who's closets to total matches available
            let winner = state.results.data.reduce((a, b) => { return Math.abs(b.total - (state.matches * state.rounds)) < Math.abs(a.total - (state.matches * state.rounds)) ? b : a})

            winner['winner'] = true;

            return {
                ...state,
                ...response
            }
        case 'new_game':

            let reset_players = [];
            state.playersList.forEach(element => {
                reset_players.push({name: element.name});
            });

            state.results.data.forEach((ele, ind) => {
                delete ele.winner;
            });

            return {
                ...state,
                cards: action.data,
                turn: 0,
                found: [],
                playersList: reset_players,
                results: {
                    data: state.results.data,
                    top: 0
                }
            }
        default:
            throw Error('Unknown action puto.');
    }
}

// const PlainGridItem = styled(Paper)(({ theme }) => ({
//     backgroundColor: 'transparent',
//     boxShadow: 'none',
//     padding: theme.spacing(0.5),
//     textAlign: 'center'
// }));

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
        results: {
            top: 0,
            data: []
        }
    });

    useEffect(() => {
        if (state.flipped.length === 2) {
            if (state.flipped[0].id === state.flipped[1].id) {
                dispatch({type: 'found_matches', found: 1});
            } 
            else {
                setTimeout(() => {
                    dispatch({type: 'flip_card', ele: {id: '', key: ''}});
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
                            <Box className={state.currentRound === 'end' || state.results.top > 0 ? 'end-game-view animate__animated animate__zoomIn' : 'none'} pt={20}>
                                <Box textAlign='center'>
                                    <Typography variant='h1' sx={{ fontSize: 80}}>
                                        { state.currentRound === 'end' ? 'Winner' : 'Well Done' }
                                    </Typography>
                                </Box>
                                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                                    { state.results.data.map((player, ind) => (
                                        <Box key={`content-${ind}`}>
                                            <Typography variant='h2' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                {player.name} { 'winner' in player ? (<EmojiEventsIcon className='winner-trophy' />) : ''}
                                            </Typography>
                                            { player.matches.map((round, i) => (
                                                <Typography variant='h4' key={`round-${i}`}>{round}</Typography>
                                            )) }
                                        </Box>
                                    ))}
                                </Box>
                                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                                    <Box mt={4}>
                                        <Button 
                                            variant='contained' color={state.currentRound === 'end' ? 'danger' : 'warning'} 
                                            sx={{ color: '#fff'}}
                                            onClick={handleAfterGame}
                                        >
                                            { (state.currentRound === 'end') ? 'End Game' : 'Next Round'}
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                            <Grid container spacing={2} alignItems='center'>
                                <Grid item md={3}>
                                    <PlainGridItem sx={{ textAlign: 'center'}}>
                                        <Typography variant="h4" sx={{ color: '#e2615d'}}>Players : { state.playersList[state.turn].name }</Typography>
                                    </PlainGridItem>
                                </Grid>
                                <Grid item md={3}>
                                    <PlainGridItem sx={{ textAlign: 'center'}}>
                                        <Typography variant="h4" sx={{ color: '#e2615d'}}>Matches: { state.found.length } / { state.matches} </Typography>
                                    </PlainGridItem>
                                </Grid>
                                <Grid item md={3}>
                                    <PlainGridItem sx={{ textAlign: 'center'}}>
                                        <Typography variant="h4" sx={{ color: '#e2615d'}}>Rounds: { state.currentRound } / { state.rounds }</Typography>
                                    </PlainGridItem>
                                </Grid>
                                <Grid item md={3}>
                                    <PlainGridItem sx={{ textAlign: 'center'}}>
                                        <Button variant="contained" color='danger' onClick={() => Navigate('/Dashboard')}>Exit</Button>
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