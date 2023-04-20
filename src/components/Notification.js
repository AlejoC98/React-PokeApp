import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'

const Notification = ({status, message}) => {

  const [classname, setClassname] = useState('none');

  useEffect(() => {
    if (message) {
      setClassname('animate__fadeIn');
      setTimeout(() => {
        setClassname('animate__fadeOut');
      }, 4000);
    }
  }, [message]);

  return (
    <Alert 
      className={`animate__animated ${classname}`} 
      severity={status} 
      sx={{ 
        position: 'absolute',
        width: '100%',
        top: 20
      }}
    >
      { message }
    </Alert>
  );

}

export default Notification