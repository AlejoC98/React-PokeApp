import React, { useEffect, useRef, useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Box, Select, TextField, useMediaQuery, FormControl, InputLabel, MenuItem, Typography } from '@mui/material'
import { GetCardSet } from '../context/PokemonContext'

const initialValues = {
    players: '',
    rounds: '',
    matches: '',
    cardset: '',
    level: ''
}

const newGameSchema = yup.object().shape({
    players: yup.string().required('This field is required'),
    rounds: yup.string().required('This field is required'),
    matches: yup.string().required('This field is required'),
    cardset: yup.string().required('This field is required'),
    level: yup.string().required('This field is required')
});

const NewGameForm = ({ form }) => {

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [cardSet, setCardSet] = useState([]);

    const [numberPlayers, setNumberPlayers] = useState();

    const playersList = useRef({});

    const handleSubmit = (values) => {
        console.log(values);
    }

    const handlePlayerNumber = (e) => {
        setNumberPlayers(e.target.value);
    }
    
    const InputFields = ({ counter }) => {
        let response = [];
        if (counter !== undefined && counter !== 0) {
            for (let index = 0; index < counter; index++) {
                response.push(
                    <TextField 
                        fullWidth
                        type='text'
                        label={`Player ${index + 1}`}
                        name={`player-${index}`}
                        key={index}
                        ref={playersList[`player-${index}`]}
                        required
                        helperText='This field is required!'
                        sx={{
                            gridColumn: 'span 4'
                        }}
                    />
                );
            }

            return response;
        }
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
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
                <form onSubmit={handleSubmit} id='new-game'>
                    <Box
                        display="grid" 
                        gap="30px"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}
                        }}
                    >
                        <TextField 
                            fullWidth
                            type='number'
                            label='#Players'
                            onBlur={handleBlur}
                            onChange={(e) => {
                                handleChange(e);
                                handlePlayerNumber(e)
                            }}
                            value={values.players}
                            name='players'
                            error={!!touched.players && !!errors.players}
                            helperText={touched.players && errors.players}
                            sx={{
                                gridColumn: 'span 2'
                            }}
                        />
                        <TextField 
                            fullWidth
                            type='number'
                            label='#Rounds'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.rounds}
                            name='rounds'
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
                                <MenuItem value='easy'>Easy</MenuItem>
                                <MenuItem value='medium'>Medium</MenuItem>
                                <MenuItem value='hard'>Hard</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant='h2' sx={{ display: numberPlayers >= 1 ? 'flex' : 'none'}}>Players:</Typography>
                        <InputFields counter={numberPlayers} />
                    </Box>
                </form>
            )}
        </Formik>
        </Box>
    )
}

export { NewGameForm }
