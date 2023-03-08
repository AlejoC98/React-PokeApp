
import {ColorModeContext, useMode} from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import TopBar from "./views/global/TopBar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./views/dashboard";
import LeftBar from "./views/global/LeftBar";
// import Dashboard from "./views/dashboard";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <LeftBar/>
          <main className="content">
            <TopBar />
            <Routes>
              <Route path="/" element={<Dashboard/>} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
