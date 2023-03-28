import { Box, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import BreadCrumb from '../../components/BreadCrumb'
import { tokens } from '../../theme';
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
        <Box className="block-container">
            <Box className="block" gridColumn="span 4"  backgroundColor={ theme.palette.mode === "dark" ? colors.spacecadet[600] : colors.gray[800]}>
                {/* <BreadCrumb /> */}
                <Box display='flex'>
                    <DisplayItems data={cardset.content} display='grid-view' module={cardset.name} />
                </Box>
            </Box>
        </Box>
    )
}

export default SetDescription
