import { Box, Select, TextField, useMediaQuery, FormControl, InputLabel, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { GetCardSet } from '../context/PokemonContext'
import { useNavigate } from 'react-router-dom'

const initialValues = {
    players: '',
    playersList: [],
    rounds: 1,
    matches: 1,
    cardset: '',
    level: ''
}

const newGameSchema = yup.object().shape({
    players: yup.string().required('This field is required'),
    playersList: yup.array().of(
        yup.object().shape({
            name: yup.string().required('This field is required')
        })
    ),
    rounds: yup.number().required('This field is required').min(1, 'At least 1 round!').max(10, "Don't use more that 10!"),
    matches: yup.number().required('This field is required').min(1, 'At least 1 matche!').max(10, "Don't use more that 10!"),
    cardset: yup.string().required('This field is required'),
    level: yup.string().required('This field is required')
});

const NewGameForm = ({ form, handleClose }) => {

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [cardSet, setCardSet] = useState([]);

    const Navigate = useNavigate();

    const handleSubmit = (values) => {
        handleClose();
        Navigate('/Game', {state : { data: values}});
    }


    function hanldePlayers(e, values, setValues) {
        const playersList = [];
        const numberOfPlayers = e.target.value || 0;
        
        for (let index = 0; index < numberOfPlayers; index++) {
            playersList.push({name: ''});
        }

        setValues({...values, playersList});
    }

    useEffect(() => {
        GetCardSet().then((res) => {
            setCardSet(res);
        });
    }, []);

    return (
        <Box mt={1}>
            <Formik 
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={newGameSchema}
            innerRef={form}
        >
            {({ values, errors, touched, setValues, handleBlur, handleChange, handleSubmit}) => (
                <form onSubmit={handleSubmit} id='new-game'>
                    <Box
                        display="grid" 
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}
                        }}
                    >
                        <FormControl sx={{ gridColumn: 'span 2' }}>
                            <InputLabel id='player-number-label'>#Players</InputLabel>
                            <Select
                                fullWidth
                                labelId='player-number-label'
                                id='players'
                                label="#Players"
                                onBlur={handleBlur}
                                onChange={ (e) => {
                                        hanldePlayers(e, values, setValues);
                                        handleChange(e);
                                    }
                                }
                                value={values.players}
                                name='players'
                                error={!!touched.players && !!errors.players}
                            >
                                { [1,2,3,4,5,6,7,8,9,10].map(i => 
                                    <MenuItem key={i} value={i}>{i}</MenuItem>    
                                ) }
                            </Select>
                        </FormControl>
                        <TextField 
                            fullWidth
                            type='number'
                            label='#Rounds'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.rounds}
                            name='rounds'
                            InputProps={{ inputProps: {min: 1, max: 10 }}}
                            error={!!touched.rounds && !!errors.rounds}
                            helperText={touched.rounds && errors.rounds}
                            sx={{
                                gridColumn: 'span 2'
                            }}
                        />
                        <TextField 
                            fullWidth
                            type='number'
                            label='#Matches'
                            InputProps={{ inputProps: {min: 1, max: 10 }}}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.matches}
                            name='matches'
                            error={!!touched.matches && !!errors.matches}
                            helperText={touched.matches && errors.matches}
                            sx={{
                                gridColumn: 'span 2'
                            }}
                        />
                        <FormControl sx={{ gridColumn: 'span 2' }}>
                            <InputLabel id='card-set-label'>CardSet</InputLabel>
                            <Select
                                fullWidth
                                labelId='card-set-label'
                                id='card-set'
                                label="Card Set"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.cardset}
                                name='cardset'
                                error={!!touched.cardset && !!errors.cardset}
                            >
                                { cardSet.map((item, index) => (
                                    <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                )) }
                            </Select>
                        </FormControl>
                        <FormControl sx={{ gridColumn: 'span 4'}}>
                            <InputLabel id="game-level-label">Level</InputLabel>
                            <Select
                                fullWidth
                                labelId='game-level-label'
                                id='game-level'
                                label="Level"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.level}
                                name='level'
                                error={!!touched.level && !!errors.level}                               
                            >
                                <MenuItem value={10}>Easy</MenuItem>
                                <MenuItem value={20}>Medium</MenuItem>
                                <MenuItem value={40}>Hard</MenuItem>
                            </Select>
                        </FormControl>                       
                    </Box>
                    <Box mt={2} textAlign='center' display={values.playersList.length > 0 ? 'grid' : 'none'}
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}
                        }}>
                        <Typography variant='h2' sx={{ gridColumn: 'span 4'}}>Players:</Typography>
                        {/* { Object.keys(errors).includes('playersList') } */}
                        { values.playersList.length > 0 &&
                            values.playersList.map((player, i) => (
                                <TextField
                                    fullWidth
                                    key={`player-${i}`}
                                    type='text'
                                    label={`Player ${i + 1}`}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={player.name}
                                    name={`playersList.${i}.name`}
                                    error={errors.playersList ? (!!touched.playersList && !!errors.playersList[i].name) : false}
                                    helperText={errors.playersList ? (touched.playersList && errors.playersList[i].name) : ''}
                                    sx={{
                                        gridColumn: values.playersList.length > 1 ? 'span 2' : 'span 4'
                                    }}
                                />
                            ))
                        }
                    </Box>
                </form>
            )}
        </Formik>
        </Box>
    )
}

export { NewGameForm }
