import { Box, Grid, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import BreadCrumb from '../../components/BreadCrumb'
import { GridItem, tokens } from '../../theme';
import { GetCardSet } from '../../context/PokemonContext';
import DisplayItems from '../../components/DisplayItems';

const SetDescription = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    let { set } = useParams();
    const [cardset, setCardSet] = useState({
        name: '',
    });

    useEffect(() => {
        GetCardSet('filter_id', {id: set}).then((res) => {
            setCardSet(res);
        });
    }, [set]);

    return (
        <Box flexGrow={1}>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <GridItem>
                        <DisplayItems data={cardset.content} display='grid-view' module={cardset.name} />
                    </GridItem>
                </Grid>
            </Grid>
        </Box>
    )
}

export default SetDescription
