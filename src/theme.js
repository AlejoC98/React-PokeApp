import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        orange: {
            100: "#fce6d3",
            200: "#f9cda7",
            300: "#f7b37a",
            400: "#f49a4e",
            500: "#f18122",
            600: "#c1671b",
            700: "#914d14",
            800: "#60340e",
            900: "#301a07"
        },
        spacecadet: {
            100: "#d4d5d9",
            200: "#aaaab3",
            300: "#7f808c",
            400: "#555566",
            500: "#2a2b40",
            600: "#222233",
            700: "#191a26",
            800: "#11111a",
            900: "#08090d"
        },
        caribbean: {
            100: "#cfe3e3",
            200: "#9fc6c7",
            300: "#6faaab",
            400: "#3f8d8f",
            500: "#0f7173",
            600: "#0c5a5c",
            700: "#094445",
            800: "#062d2e",
            900: "#031717"
        },
        midnightgreen: {
            100: "#020f13",
            200: "#031e27",
            300: "#052e3a",
            400: "#063d4e",
            500: "#084c61",
            600: "#397081",
            700: "#6b94a0",
            800: "#9cb7c0",
            900: "#cedbdf",
        },
        poppy: {
            100: "#f8d8d6",
            200: "#f1b0ae",
            300: "#e98985",
            400: "#e2615d",
            500: "#db3a34",
            600: "#af2e2a",
            700: "#83231f",
            800: "#581715",
            900: "#2c0c0a"
        },
        yellow: {
          100: "#fef4da",
          200: "#feeab5",
          300: "#fddf90",
          400: "#fdd56b",
          500: "#fcca46",
          600: "#caa238",
          700: "#97792a",
          800: "#65511c",
          900: "#32280e"
      },
      gray: {
        100: "#ebefee",
        200: "#d7dfdd",
        300: "#c4cecb",
        400: "#b0beba",
        500: "#9caea9",
        600: "#7d8b87",
        700: "#5e6865",
        800: "#3e4644",
        900: "#1f2322"
      },
    } : {
        orange: {
            100: "#fce6d3",
            200: "#f9cda7",
            300: "#f7b37a",
            400: "#f49a4e",
            500: "#f18122",
            600: "#c1671b",
            700: "#914d14",
            800: "#60340e",
            900: "#301a07"
        },
        spacecadet: {
            100: "#08090d",
            200: "#11111a",
            300: "#191a26",
            400: "#222233",
            500: "#2a2b40",
            600: "#555566",
            700: "#7f808c",
            800: "#aaaab3",
            900: "#d4d5d9"
        },
        caribbean: {
            100: "#031717",
            200: "#062d2e",
            300: "#094445",
            400: "#0c5a5c",
            500: "#0f7173",
            600: "#3f8d8f",
            700: "#6faaab",
            800: "#9fc6c7",
            900: "#cfe3e3",
        },
        midnightgreen: {
            100: "#020f13",
            200: "#031e27",
            300: "#052e3a",
            400: "#063d4e",
            500: "#084c61",
            600: "#397081",
            700: "#6b94a0",
            800: "#9cb7c0",
            900: "#cedbdf",
        },
        poppy: {
            100: "#2c0c0a",
            200: "#581715",
            300: "#83231f",
            400: "#af2e2a",
            500: "#db3a34",
            600: "#e2615d",
            700: "#e98985",
            800: "#f1b0ae",
            900: "#f8d8d6",
        },
        yellow: {
          100: "#32280e",
          200: "#65511c",
          300: "#97792a",
          400: "#caa238",
          500: "#fcca46",
          600: "#fdd56b",
          700: "#fddf90",
          800: "#feeab5",
          900: "#fef4da",
      },
      gray: {
        100: "#1f2322",
        200: "#3e4644",
        300: "#5e6865",
        400: "#7d8b87",
        500: "#9caea9",
        600: "#b0beba",
        700: "#c4cecb",
        800: "#d7dfdd",
        900: "#ebefee",
    },
      }),
});

// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.midnightgreen[500],
            },
            secondary: {
              main: colors.gray[500],
            },
            danger: {
              main: colors.poppy[500]
            },
            warning: {
              main: colors.orange[500],
            },
            neutral: {
              dark: colors.orange[700],
              main: colors.orange[500],
              light: colors.orange[100],
            },
            background: {
              default: colors.spacecadet[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.midnightgreen[600],
            },
            secondary: {
              main: colors.caribbean[500],
            },
            danger: {
              main: colors.poppy[500]
            },
            warning: {
              main: colors.orange[500],
            },
            neutral: {
              dark: colors.orange[700],
              main: colors.orange[500],
              light: colors.orange[100],
            },
            text: {
              primary: '#fcfcfc'
            },
            background: {
              default: colors.gray[800],
            },
          }),
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};

export const GridItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#191a26' : '#555566',
  fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
  padding: theme.spacing(2),
  color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : '#ffffff',
}));

// export const GridItem = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#191a26' : '#3e4644',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));