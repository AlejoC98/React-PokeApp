import { Box, TextField } from '@mui/material'
import React from 'react'

const Login = () => {
  return (
    <Box display="flex">
      <form>
        <TextField id='username' label='Username' variant='standard' fullWidth/>
      </form>
    </Box>
  )
}

export default Login