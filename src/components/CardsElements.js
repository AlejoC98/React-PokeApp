import { Box, Button } from '@mui/material'
import React from 'react'

const CardsElements = ({ data, dispatch }) => {

    function handleClick() {
        dispatch({type: 'GET_CARDS'});
    }

    console.log(data.cards);

  return (
    <Box>
        <Button onClick={handleClick}> Click me!</Button>
    </Box>
  )
}

export default CardsElements