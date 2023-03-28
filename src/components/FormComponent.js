import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Box, Select, TextField, useMediaQuery, FormControl, InputLabel, MenuItem } from '@mui/material'
import { GetCardSet } from '../context/PokemonContext'

const initialValues = {
    players: '1',
    rounds: '',
    matches: '',
    cardset: '',
    level: 'easy'
}

const newGameSchema = yup.object().shape({
    players: yup.string().required('This field is required'),
    rounds: yup.string().required('This field is required'),
    matches: yup.string().required('This field is required'),
    cardset: yup.string().required('This field is required'),
    level: yup.string().required('This field is required')
});

const SelectItems = ({ data }) => {
    var items = [];

    if (data !== undefined) {

        const handleSelectChange = ({ selected }) => {
            initialValues.cardset = selected;
        }

        data.forEach((set, index) => {
            items.push(<MenuItem key={index} value={set.id} onClick={handleSelectChange(set.name)}>{set.name}</MenuItem>);
        });

        return (
            <Select
                labelId='cardSetLabel'
                id='cardset'
                value={initialValues.cardset}
                label='Card Sets'
                placeholder="Select Card Set"
                variant='outlined'
            >
                { items }
            </Select>
        );
    }
}

const NewGameForm = () => {

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [cardSet, setCardSet] = useState();

    const handleSubmit = (values) => {
        console.log(values);
    }

    useEffect(() => {
        GetCardSet().then((res) => {
            setCardSet(res);
        });
    }, []);

    return (
        <Box>
            <Formik 
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={newGameSchema}
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
                <form onSubmit={handleSubmit}>
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
                            variant='outlined'
                            type='number'
                            label='#Players'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onKeyUp={handleChange}
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
                            variant='outlined'
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
                            variant='outlined'
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
                            <InputLabel id='cardSetLabel'>CardSet</InputLabel>
                            <SelectItems data={cardSet} />
                        </FormControl>
                        <FormControl sx={{ gridColumn: 'span 4'}}>
                            <InputLabel id='game-level'>Level</InputLabel>
                            <Select
                                labelId='game-level'
                                id='level'
                                value={initialValues.level}
                                variant='outlined'
                            >
                                <MenuItem value="easy" >Easy</MenuItem>
                                <MenuItem value="medium" >Medium</MenuItem>
                                <MenuItem value="hard" >Hard</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </form>
            )}
        </Formik>
        </Box>
    )
}

export { NewGameForm }
