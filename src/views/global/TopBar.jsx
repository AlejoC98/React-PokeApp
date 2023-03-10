import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { useTheme, Box, IconButton, Avatar, MenuList, MenuItem, Popper, AppBar, Toolbar } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import InputBase from "@mui/material/InputBase";
import SearchIcon from '@mui/icons-material/Search';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = () => {

  const { user, logOut } = UserAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  // Functions for user menu popper
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "user-menu" : undefined;

  // Sarchbar Styles
  const Search = styled('div')(({ theme }) => ({
    display: 'flex',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.15) : colors.spacecadet[700],
    '&:hover': {
      backgroundColor: theme.palette.mode === "dark" ? colors.spacecadet[400] : colors.spacecadet[600],
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));
  
  const handleLogOut = async() => {
    await logOut().then((res) => {
      navigate('/Login');
    }).catch((err) => {
      console.log(err);
    })
  }
  return (
    <Box flexGrow={1}>
      <AppBar position="static" sx={{ background: "transparent", boxShadow: "none", left: 90}}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon/>
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search.." aria-label="search"/>
          </Search>
          <Box display="flex" alignItems="center">
            <Box>
              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                  <LightModeOutlinedIcon/>
                  ) : (
                    <DarkModeOutlinedIcon/>
                )}
              </IconButton>
              <IconButton>
                <NotificationsOutlinedIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton aria-describedby={id} onClick={handleClick}>
                <Avatar alt={user.displayName} src={user.photoURL} />
              </IconButton>
              <Popper id={id} open={open} anchorEl={anchorEl}>
                <MenuList sx={{ background: colors.spacecadet[600]}}>
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