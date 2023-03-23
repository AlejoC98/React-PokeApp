import { Box, useTheme } from '@mui/material'
import React from 'react'
import { tokens } from '../../theme';

const Game = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box className="block-container">
      <Box className="block" gridColumn="span 4"  backgroundColor={ theme.palette.mode === "dark" ? colors.spacecadet[600] : colors.gray[800]}>
        lreoimm
      </Box>
    </Box>
  )
}

export default Game
