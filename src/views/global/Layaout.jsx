import React from 'react';
// import {ColorModeContext, useMode} from "./theme";
import { ColorModeContext, tokens, useMode } from '../../theme';
import { Box, CssBaseline, ThemeProvider, useTheme } from "@mui/material";
import { Outlet} from "react-router-dom";
import TopBar from './TopBar';
import LeftBar from './LeftBar'

const AppLayaout = () => {

    const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <LeftBar/>
          <main className="content">
            <TopBar />
            <Outlet />
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

const AuthLayout = () => {
    const [theme, colorMode] = useMode();

    const ctheme = useTheme();
    const colors = tokens(ctheme.palette.mode);

    // theme.palette.background.default = colors.caribbean[400];
    theme.palette.background = colors.caribbean[400];
    theme.palette.primary.main = colors.poppy[500];

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                  <Box display="flex" top={0} bottom={0} left={0} right={0} position="absolute" sx={{ backgroundImage: 'url(/static/images/login-wallpaper.jpg)', backgroundSize: "cover", backgroundPosition: 'bottom right', backgroundRepeat: 'no-repeat' , filter: 'blur(3px)' }}></Box>
                  <Box display="flex" p={5} flexDirection="column" borderRadius={2} width={400} zIndex={1000} sx={{ backdropFilter: "initial", WebkitBackdropFilter: "blur(10px)", background: 'RGBA(51,51,51,0.42)' }}>
                    <Outlet />
                  </Box>
                </Box>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )

}

export { AppLayaout, AuthLayout }