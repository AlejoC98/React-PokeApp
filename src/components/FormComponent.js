import { Box, Select, TextField, useMediaQuery, FormControl, InputLabel, MenuItem, Typography, FormHelperText } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { GetCardSet, SetUpGame } from '../context/PokemonContext'
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext'
import { createCollection, queryCollection, updateCollection } from '../context/FirebaseContext'

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
            name: yup.string().required('This field is required').test('is-unique', 'You can repeat a player name', async function(value) {
                const { path, createError } = this;
                const otherNames = this.from[1].value.playersList.map(p => {
                    if (p.name === undefined)
                        p.name = '';
                    return p.name.toLowerCase();
                });
                const isUnique = otherNames.filter(p => p === value.toLowerCase());
                if (isUnique.length > 1) {
                    throw createError({ path, message: 'You cannot repeat a player name' });
                }
                return true;
            })
        })
    ),
    rounds: yup.number().required('This field is required').min(1, 'At least 1 round!').max(10, "Don't use more that 10!"),
    matches: yup.number().required('This field is required').min(1, 'At least 1 matche!').max(40, "Don't use more that 10!"),
    cardset: yup.string().required('This field is required'),
    level: yup.string().required('This field is required')
});

const NewGameForm = ({ form, handleClose, setIsLoading }) => {

    const { user } = UserAuth();

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [cardSet, setCardSet] = useState([]);

    const Navigate = useNavigate();

    const handleSubmit = (values, { resetForm }) => {
        handleClose();
        setIsLoading(true);
        SetUpGame(values.cardset, values.level, values.matches).then(async(res) => {
            resetForm();
            await queryCollection('user_games', [
                {field: 'user_id', operator: '==', value: user.id}
            ]).then(async(ug_res) => {
                if (ug_res.length === 0) {
                    ug_res = await createCollection('user_games', {
                        user_id: user.id,
                        times_played: 1,
                        times_won: 0,
                        times_lost: 0,
                        times_tied: 0,
                        easy_times: values.level === 10 ? 1 : 0,
                        medium_times: values.level === 20 ? 1 : 0,
                        hard_times: values.level === 40 ? 1 : 0
                    });
                } else {

                    let update_data = {
                        times_played: ug_res.times_played + 1
                    };

                    switch (values.level) {
                        case 10:
                            update_data['easy_times'] = 1 + ug_res.easy_times;
                            break;
                        case 20:
                            update_data['medium_times'] = 1 + ug_res.medium_times;
                            break;
                        case 40:
                            update_data['hard_times'] = 1 + ug_res.hard_times;
                            break;
                        default:
                            throw new Error('Level no reconizeg');
                    }
                    await updateCollection('user_games', ug_res.record_id, update_data);
                }

                setIsLoading(false);

                Navigate('/Game', {state : { data: values, cards: res, userGame: ug_res}});
            });
        }).catch((err) => {
            console.log(err);
        })
    }


    function hanldePlayers(e, values, setValues) {
        const playersList = [];
        const numberOfPlayers = e.target.value || 0;
        
        for (let index = 0; index < numberOfPlayers; index++) {
            playersList.push({name: (index === 0 ? user.displayName.split(' ')[0] : '')});
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
            {({ values, errors, touched, setValues, handleBlur, handleChange, handleSubmit, getFieldProps}) => (
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
                            <FormHelperText error={touched.players && errors.players}>{errors.players}</FormHelperText>
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
                            InputProps={{ inputProps: {min: 1, max: 40 }}}
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
                            <FormHelperText error={touched.cardset && errors.cardset}>{ touched.cardset && errors.cardset ? errors.cardset : ''}</FormHelperText>
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
                                <MenuItem value={10} disabled={values.matches > 5 ? true : false}>Easy</MenuItem>
                                <MenuItem value={20} disabled={values.matches > 10 ? true : false}>Medium</MenuItem>
                                <MenuItem value={40} disabled={values.matches > 20 ? true : false}>Hard</MenuItem>
                            </Select>
                            <FormHelperText error={touched.level && errors.level}>{ touched.level && errors.level ? errors.level : ''}</FormHelperText>
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
                            values.playersList.map((player, i) => {
                                return (
                                    <TextField
                                        fullWidth
                                        key={`player-${i}`}
                                        type='text'
                                        label={`Player ${i + 1}`}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{style: {textTransform: 'capitalize'}}}
                                        value={player.name}
                                        name={`playersList.${i}.name`}
                                        {...getFieldProps(`playersList.${i}.name`)}
                                        error={touched.playersList?.[i]?.name && !!errors.playersList?.[i]?.name}
                                        helperText={touched.playersList?.[i]?.name && errors.playersList?.[i]?.name}
                                        sx={{
                                            gridColumn: values.playersList.length > 1 ? 'span 2' : 'span 4'
                                        }}
                                    />
                                )

                            })
                        }
                    </Box>
                </form>
            )}
            </Formik>
        </Box>
    )
}

export { NewGameForm }
