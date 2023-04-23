import { Alert, Box } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Notification = ({status, message, type = 'login'}) => {

  // const [classname, setClassname] = useState('none');

  const [display, setDisplay] = useState(true);

  useEffect(() => {
    if (message) {
      setDisplay(true);
      setTimeout(() => {
        setDisplay(false);
      }, 4000);
    }
  }, [message]);

  return (
    <Box className={type === 'login' ? '' : 'alert-content'} position='absolute' width='100%'>
      { status !== undefined && (
        <Alert 
          className={`animate__animated ${display ? 'animate__fadeIn' : 'animate__fadeOut'}`} 
          severity={status} 
          sx={{ 
            // position: 'absolute',
            position: 'relative',
            width: '100%',
            top: 20
          }}
        >
          { message }
        </Alert>
      )}
    </Box>
  );

}

export default Notification