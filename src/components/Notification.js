import { Alert } from '@mui/material'
import React, { useEffect, useReducer } from 'react'

function reducer(state, action) {
  switch (action.type) {
    case 'show':
      return {
        classname: 'animate__fadeIn',
        display: true
      }
    case 'hide':
      return {
        classname: 'animate__fadeOut',
        display: false
      }
    default:
      throw new Error('Action not found');
  }
}

const Notification = ({status, message}) => {

  const [state, dispatch] = useReducer(reducer, {
    classname: '',
    display: false
  });

  useEffect(() => {
     if (message) {
       dispatch({ type: 'show' });
       setTimeout(() => {
         dispatch({ type: 'hide' });
       }, 5000);
     }


  }, [message]);
  
  if (state.display === true) {
    return (
      <Alert className={`animate__animated ${state.classname}`} severity={status} sx={{ position: 'relative'}}>{ message }</Alert>
    );
  }
}

export default Notification