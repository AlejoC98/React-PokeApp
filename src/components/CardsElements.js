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

  console.log(found)

  return (
    <PlainGridItem className='animate__animated animate__flipInX'>
      <Box className='CardContainer' sx={{ 
        width: { xs: 58, sm: 58, md: 90}, 
        height: { xs: 80, sm: 80, md: 124.73},
      }}>
        {/* <Box className={found ? 'found' : 'none'}></Box> */}
        <Box className={active ? 'PokeCard active' : 'PokeCard'} >
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