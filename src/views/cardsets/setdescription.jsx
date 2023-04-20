import { Box, Grid, useTheme} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import BreadCrumb from '../../components/BreadCrumb'
import { GridItem, tokens } from '../../theme';
import { GetCardSet } from '../../context/PokemonContext';
import DisplayItems from '../../components/DisplayItems';
import { BallTriangle } from 'react-loader-spinner';


const SetDescription = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    let { set } = useParams();
    const [cardset, setCardSet] = useState([]);

    useEffect(() => {
        GetCardSet('filter_name', {name: set}).then((res) => {
            setCardSet(res);
        });
    }, [set]);

    return (
        <Box flexGrow={1}>
            <Grid container spacing={2}>
                <Grid item md={12}>
                    <GridItem>
                        { cardset.length > 0 ? (
                            <DisplayItems data={cardset} display='grid-view'/>
                        ) : (
                            <Box width='100%' height='100%' display='flex' justifyContent='center' alignItems='center'>
                                <BallTriangle
                                    color={colors.caribbean[500]}
                                />
                            </Box>
                        ) } 
                    </GridItem>
                </Grid>
            </Grid>
        </Box>
    )
}

export default SetDescription
