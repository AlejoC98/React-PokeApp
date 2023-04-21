import { ColorModeContext, tokens, useMode } from '../../theme';
import { Box, CssBaseline, ThemeProvider, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import TopBar from './TopBar';
import LeftBar from './LeftBar';
import { useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';

const AppLayaout = () => {

  const [theme, colorMode] = useMode();
  const isNonMobile = useMediaQuery("(min-width:900px)");

  const [isLoading, setIsLoading] = useState(false);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{ display: 'flex', alignItems: 'center'}}>
          { isLoading && (
            <Box
                position='absolute'
                top={0}
                left={0}
                backgroundColor='RGBA(180,180,180,0.44)'
                width='100%'
                height='100%'
                zIndex={100000}
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <BallTriangle
                />
            </Box>
          )}
          <LeftBar/>
          <main 
            className="content" 
            style={{ 
              position: 'relative', 
              left: isNonMobile ? 100 : 0,
              width: isNonMobile ? 'calc(100% - 100px)' : '100%',
              top: 64,
              padding: '20px 10px'
            }}
          >
            <TopBar setIsLoading={setIsLoading} />            
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
            <Box display="flex" p={5} pt={0} flexDirection="column" borderRadius={2} width={400} zIndex={1000} sx={{ backdropFilter: "initial", WebkitBackdropFilter: "blur(10px)", background: 'RGBA(51,51,51,0.42)' }} className='animate__animated animate__fadeInUp' height='53%'>
              <Outlet />
            </Box>
          </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )

}

export { AppLayaout, AuthLayout }