import { Box, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import { GridItem, tokens } from "../../theme";
import { GetCardSet } from '../../context/PokemonContext';
import DisplayItems from '../../components/DisplayItems';
import { BallTriangle } from 'react-loader-spinner';

const CardSet = () => {

  const [cardSets, setCardSets] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
          {/* <DisplayItems data={cardSets} /> */}
          { cardSets.length > 0 ? (
            <DisplayItems data={cardSets} />
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

export default CardSet
