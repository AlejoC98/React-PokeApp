
import {colorModeContext, useMode} from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import TopBar from "./views/global/TopBar";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <colorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <TopBar />
          </main>
        </div>
      </ThemeProvider>
    </colorModeContext.Provider>
  );
}

export default App;
