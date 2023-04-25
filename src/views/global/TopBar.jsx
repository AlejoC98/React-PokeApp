import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { useTheme, Box, IconButton, Avatar, MenuList, MenuItem, Popper, AppBar, Toolbar, FormGroup, FormControlLabel, Typography } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DialogComponent from "../../components/DialogComponent";
import SearchBar from "../../components/SearchBar";
import HamburgerMenu from "../../components/HamburgerMenu";
import Switch from '@mui/material/Switch';
import { getUserNotification, updateCollection } from "../../context/FirebaseContext";
import Badge from '@mui/material/Badge';
import PersonIcon from '@mui/icons-material/Person';

const Topbar = ({setIsLoading}) => {
  // Setting const
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [themeChecked, setThemeChecked] = useState(true);
  
  // Setting for the user poper
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const userOpen = Boolean(userAnchorEl);
  const userId = userOpen ? "user-menu" : undefined;
  // Setting fot the notification poper
  const [notiAnchorEl, setNotiAnchorEl] = useState(null);
  const notiOpen = Boolean(notiAnchorEl);
  const notiId = notiOpen ? "notification-menu" : undefined;

  // Notifications
  const [notifications, setnotifications] = useState([]);

  // Functions for user menu popper
  const handleUserClick = (event) => {
    setUserAnchorEl(userAnchorEl ? null : event.currentTarget);
    setNotiAnchorEl(null);
  };
  // Functions for user notification popper
  const handleNotiClick = (event) => {
    setNotiAnchorEl(notiAnchorEl ? null : event.currentTarget);
    setUserAnchorEl(null);
  };
  
  const handleThemeSwitch = () => {
    setThemeChecked(!themeChecked);
    colorMode.toggleColorMode();
  }

  const handleLogOut = async() => {
    await logOut().then((res) => {
      navigate('/Login');
    }).catch((err) => {
      console.log(err);
    })
  };

  const handleOpenNoti = (notification) => {
    setNotiAnchorEl(null);
    updateCollection('user_notifications', notification.record_id, {status: true} ).then((res) => {
      notification.status = true;
      if (res)
        navigate(`Dashboard/${notification.link}`, {state: {...notification}});
    }).catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    setInterval(() => {
      getUserNotification().then((res) => {
        if (res.length > 0)
          setnotifications(res);
      });
    }, 300000);
  }, []);


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
              <IconButton onClick={handleNotiClick}>
                <Badge badgeContent={notifications.filter(n => n.status === false).length} color="danger">
                  <NotificationsOutlinedIcon />
                </Badge>
              </IconButton>
              <Popper id={notiId} open={notiOpen} anchorEl={notiAnchorEl} sx={{ zIndex: 1000, p: 2}}>
                <MenuList sx={{ background: colors.spacecadet[600], borderRadius: 1}}>
                  { notifications.length > 0 ? notifications.map((noty, ind) => (
                    <MenuItem 
                      key={`noty-${ind}`} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        maxWidth: 180,
                        overflow: 'hidden',
                        p: 1
                      }}
                      onClick={() => handleOpenNoti(noty)}
                    >
                      <PersonIcon sx={{
                        position: 'relative',
                        top: -3,
                        mr: 0.5
                      }}/>
                      <Typography>
                        { noty.text }
                      </Typography>
                    </MenuItem>
                  )) : (
                    <MenuItem>
                      <Typography>Nothing to check yet!</Typography>
                    </MenuItem>
                  ) }
                </MenuList>
              </Popper>
            </Box>
            <Box sx={{
              marginRight: {
                xs: 1,
                sm: 1
              }
            }}>
              <IconButton aria-describedby={userId} onClick={handleUserClick}>
                <Avatar alt={user !== null ? user.displayName : "temp"} src={user !== null ? user.photoURL : "http://"} />
              </IconButton>
              <Popper id={userId} open={userOpen} anchorEl={userAnchorEl} sx={{ zIndex: 1000}}>
                <MenuList sx={{ background: colors.spacecadet[600], borderRadius: 1 }}>
                  <MenuItem sx={{
                    display: {
                      xs: 'inline-flex',
                      sm: 'none',
                    }
                  }}>
                    <FormGroup>
                      <FormControlLabel
                        label='Theme'
                        control={
                          <Switch 
                            checked={themeChecked}
                            onClick={handleThemeSwitch}
                            name='themeSwitch'
                            color='warning'
                            icon={<DarkModeOutlinedIcon />}
                            checkedIcon={<LightModeOutlinedIcon />}
                            size="large"
                          />
                        }
                      />
                    </FormGroup>
                  </MenuItem>
                  <MenuItem onClick={() => {
                      navigate(`Dashboard/${user.id}`, {state: {link: user.id}});
                      setUserAnchorEl(null);
                    }
                  }
                  >
                    My Account
                  </MenuItem>
                  {/* <MenuItem>Awards</MenuItem> */}
                  <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </MenuList>
              </Popper>
            </Box>
            <HamburgerMenu setIsLoading={setIsLoading} poperOpen={handleUserClick} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Topbar;