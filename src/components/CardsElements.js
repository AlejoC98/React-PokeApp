import { Box } from '@mui/material'
import React from 'react'
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import pokecard from '../static/images/pokecard.png'
import 'animate.css';

const PlainGridItem = styled(Paper)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  backgroundImage: 'none',
  border: 0
}));

const CardsElements = ({ card, active, found }) => {

  // console.log(card);

  // console.log(found);

  return (
    <PlainGridItem className='animate__animated animate__flipInX'>
      <Box className={found ? 'CardContainer beating' : 'CardContainer'} sx={{ 
        width: { xs: 80, sm: 80, md: 110}, 
        height: { xs: 100, sm: 100, md: 140},
      }}>
        {/* <Box className={found ? 'found' : 'none'}></Box> */}
        {/* <Box className={active || found ? 'PokeCard active' : 'PokeCard'} > */}
        <Box className={active ? 'PokeCard active' : found ? 'PokeCard found' : 'PokeCard'} >
          <Box className='front'>
            <img src={pokecard} alt="Avatar" style={{ width: '100%', height: '100%'}}/>
          </Box>
          <Box className='back' sx={{ transform : found ? 'scale(4)' : ''}}>
            <img src={card.images.small} alt="Avatar" style={{ width: '100%', height: '100%'}}/>
          </Box>
        </Box>
      </Box>
    </PlainGridItem>
  )
}

export default CardsElements