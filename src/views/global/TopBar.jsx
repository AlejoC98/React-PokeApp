import { Box, IconButton, Menu, MenuItem, AppBar, useTheme, Toolbar, InputBase } from "@mui/material";
import { Container } from "@mui/system";
import MenuIcon from '@mui/icons-material/Menu';
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import SearchIcon from "@mui/icons-material/Search";

const TopBar = () => {
  
  const theme = useTheme();
  const colors = tokens(theme.pallet.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box display="flex" position="relative" justifyContent="space-between" backgroundColor={colors.spacecadet[500]} left={200}>
      <AppBar position="static">
        <Container maxWidth="x1">
          <Toolbar>
            <Box flexGrow={1} display={{ xs:'flex', md: 'none'}}>
              <IconButton size="large" aria-label="User" aria-controls="menu-appbar" aria-haspopup="true" color="inherit">
                <MenuIcon />
              </IconButton>
              <Menu id="menu-appbar"anchorOrigin={{ vertical: "bottom", horizontal: 'left'}}>

              </Menu>
            </Box>
            <Box>
              <InputBase>
                <IconButton>
                  <SearchIcon/>
                </IconButton>
              </InputBase>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}

export default TopBar
