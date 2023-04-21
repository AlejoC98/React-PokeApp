import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { useTheme, Box, IconButton, Avatar, MenuList, MenuItem, Popper, AppBar, Toolbar } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DialogComponent from "../../components/DialogComponent";
import SearchBar from "../../components/SearchBar";
import HamburgerMenu from "../../components/HamburgerMenu";

const Topbar = ({setIsLoading}) => {
  // Setting const
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "user-menu" : undefined;

   // Functions for user menu popper
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  
  const handleLogOut = async() => {
    await logOut().then((res) => {
      navigate('/Login');
    }).catch((err) => {
      console.log(err);
    })
  };


  return (
    <Box>
      <AppBar position="fixed" sx={
          { 
            left: { xs: 0, sm: 0, md: 80}, 
            width: { xs: '100%', sm: '100%', md: 'calc(100% - 80px)'}, 
            background: theme.palette.mode === 'dark' ? colors.spacecadet[500] : colors.gray[800], 
            boxShadow: "none"
          }
        }>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Here's goes the search bar */}
          <SearchBar />
          <Box display="flex" alignItems="center" sx={{
            justifyContent: {
              xs: 'space-between',
              sm: 'space-between'
            }
          }}>
            <Box sx={{
              display: {
                xs: 'none',
                sm: 'none',
                md: 'block'
              }
            }}>
              <DialogComponent title='Create New Game' buttonText={'Create'} innerModule='./NewGameFormComponent' setIsLoading={setIsLoading}/>
            </Box>
            <Box sx={{
              display: {
                xs: 'none',
                sm: 'inline-flex',
                md: 'inline-flex'
              }
            }}>
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <LightModeOutlinedIcon />
                ) : (
                  <DarkModeOutlinedIcon />
                )}
              </IconButton>
              <IconButton>
                <NotificationsOutlinedIcon />
              </IconButton>
            </Box>
            <Box sx={{
              marginRight: {
                xs: 1,
                sm: 1
              }
            }}>
              <IconButton aria-describedby={id} onClick={handleClick}>
                <Avatar alt={user !== null ? user.displayName : "temp"} src={user !== null ? user.photoURL : "http://"} />
              </IconButton>
              <Popper id={id} open={open} anchorEl={anchorEl} sx={{ zIndex: 1000}}>
                <MenuList sx={{ background: colors.spacecadet[600] }}>
                  <MenuItem>My Account</MenuItem>
                  <MenuItem>Awards</MenuItem>
                  <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </MenuList>
              </Popper>
            </Box>
            <HamburgerMenu setIsLoading={setIsLoading} poperOpen={handleClick} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Topbar;