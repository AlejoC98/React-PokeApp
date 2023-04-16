import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import { GridItem } from "../../theme";
import { GetCardSet } from '../../context/PokemonContext';
import DisplayItems from '../../components/DisplayItems';

const CardSet = () => {

  const [cardSets, setCardSets] = useState([]);

  useEffect(() => {
    GetCardSet().then((res) => {
      setCardSets(res);
    });
  }, []);

  return (
    <Box flexGrow={1} >
    <Grid container spacing={2}>
      <Grid item md={12}>
        <GridItem>
          <DisplayItems data={cardSets} />
        </GridItem>
      </Grid>
    </Grid>
  </Box>
  )
}

export default CardSet
