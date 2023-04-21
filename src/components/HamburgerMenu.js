import { Box, IconButton, List, useTheme, MenuItem, alpha, ListItemIcon, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '../theme';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import StyleIcon from '@mui/icons-material/Style';
import GroupIcon from '@mui/icons-material/Group';
import DialogComponent from './DialogComponent';

const Item = ({ title, to, icon, selected, setSelected, setOpen}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    return (
      <MenuItem 
        component={Link} 
        to={to} 
        selected={selected === title} 
        onClick={() => {
            setSelected(title);
            setOpen(false);
        }}
        sx={{
          "&.Mui-selected" : { backgroundColor: alpha(colors.orange[500], 0.25), transition: "all .5s ease 0s" }
        }}
      >
        <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', color: "#ffffff", padding: 1}}>
          { icon }
        </ListItemIcon>
        <ListItemText>
            { title }
        </ListItemText>
      </MenuItem>
    )
  }

const HamburgerMenu = ({ setIsLoading, poperOpen }) => {

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

  return (
    <Box sx={{ 
        display: {
            md: 'none'
        }
    }}>
        <MenuIcon onClick={() => {
          setOpen(true);
          poperOpen();
          }} />
        <Box className={`hamburger-menu ${open ? 'open' : ''}`}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                <Box ml={2}>
                    <DialogComponent title='Create New Game' buttonText={'Create'} innerModule='./NewGameFormComponent' setIsLoading={setIsLoading} setOpenMenu={setOpen} />   
                </Box>
                <IconButton >
                    <CloseIcon onClick={() => setOpen(false)} />
                </IconButton>
            </Box>
            <Box display='flex' justifyContent='center'>
                <List sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                }}>
                    <Item
                        title="Dashboard"
                        to="/Dashboard"
                        icon={<HomeIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        setOpen={setOpen}
                    />
                    {/* <Item
                    title="Game"
                    to="/CardSet"
                    icon={<VideogameAssetIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    /> */}
                    <Item
                        title="Card Set"
                        to="/CardSet"
                        icon={<StyleIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        setOpen={setOpen}
                    />
                    <Item
                        title="Friends"
                        to="/Friends"
                        icon={<GroupIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        setOpen={setOpen}
                    />
                </List>
            </Box>
        </Box>
    </Box>
  )
}

export default HamburgerMenu