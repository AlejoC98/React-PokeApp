// import { lazy } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, useTheme } from '@mui/material'
import { tokens } from '../theme';
import { useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { NewGameForm } from './FormComponent';

const DialogComponent = ({ title, buttonText, innerModule }) => {

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // const content = lazy(() => import('./NGFComponent'));

  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <Box>
      <Button variant="contained" color="primary" endIcon={<PlayArrowIcon />} onClick={handleOpen}>
        Play
      </Button>

      <Dialog
        open={open}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        onClose={handleClose}
        fullWidth
        sx={{
          ".MuiPaper-root": {
            backgroundColor: colors.caribbean[600]
          }
        }}
      >
        <DialogTitle sx={{ fontSize: 35}}>
          {title}
        </DialogTitle>
        <DialogContent>
          <NewGameForm />
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between'}}>
            <Button variant='contained' color='secondary' sx={{ color: '#ffffff'}} onClick={handleClose}>Close</Button>
            <Button variant='contained' color='warning' sx={{ color: '#ffffff'}}>{buttonText}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DialogComponent