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
          <Box display="flex" alignItems="center">
            <Box>
              <DialogComponent title='Create New Game' buttonText={'Create'} innerModule='./NewGameFormComponent' setIsLoading={setIsLoading}/>
            </Box>
            <Box>
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
            <Box>
              <IconButton aria-describedby={id} onClick={handleClick}>
                <Avatar alt={user !== null ? user.displayName : "temp"} src={user !== null ? user.photoURL : "http://"} />
              </IconButton>
              <Popper id={id} open={open} anchorEl={anchorEl}>
                <MenuList sx={{ background: colors.spacecadet[600] }}>
                  <MenuItem>My Account</MenuItem>
                  <MenuItem>Awards</MenuItem>
                  <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </MenuList>
              </Popper>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Topbar;