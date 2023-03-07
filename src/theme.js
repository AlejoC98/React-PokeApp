import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// ColorDesign Tokens

export const tokens = (mode) => ({
    ...(mode === 'dark' 
    ? {
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
            100: "#cedbdf",
            200: "#9cb7c0",
            300: "#6b94a0",
            400: "#397081",
            500: "#084c61",
            600: "#063d4e",
            700: "#052e3a",
            800: "#031e27",
            900: "#020f13"
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
    } : {
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
        orange: {
            100: "#301a07",
            200: "#60340e",
            300: "#914d14",
            400: "#c1671b",
            500: "#f18122",
            600: "#f49a4e",
            700: "#f7b37a",
            800: "#f9cda7",
            900: "#fce6d3",
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
    }
    )
});

// MUI theme settings
export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
        pallet: {
            mode: mode,
            ...(mode === 'dark' 
                ? {
                    primary: {
                        main : colors.orange[500]
                    },
                    secondary: {
                        main: colors.midnightgreen[500]
                    },
                    neutral: {
                        dark: colors.caribbean[700],
                        main: colors.caribbean[500],
                        light: colors.caribbean[100]
                    },
                    background : {
                        default: colors.orange[500]
                    }
                } : {
                    primary: {
                        main : colors.orange[500]
                    },
                    secondary: {
                        main: colors.midnightgreen[500]
                    },
                    neutral: {
                        dark: colors.caribbean[700],
                        main: colors.caribbean[500],
                        light: colors.caribbean[100]
                    },
                    background : {
                        default: "#fcfcfc"
                    }
                }),
        }, typography : {
            fontFamily: ["Tilt Neon", "cursive"].join(","),
            fontSize: 12,
            h1 : {
                fontFamily: ["Tilt Neon", "cursive"].join(","),
                fontSize: 40
            },
            h2 : {
                fontFamily: ["Tilt Neon", "cursive"].join(","),
                fontSize: 32
            },
            h3 : {
                fontFamily: ["Tilt Neon", "cursive"].join(","),
                fontSize: 24
            },
            h4 : {
                fontFamily: ["Tilt Neon", "cursive"].join(","),
                fontSize: 20
            },
            h5 : {
                fontFamily: ["Tilt Neon", "cursive"].join(","),
                fontSize: 16
            },
            h6 : {
                fontFamily: ["Tilt Neon", "cursive"].join(","),
                fontSize: 14
            },
        }
    };
};

// Context for color mode
export const ColorModeContext = createContext({
    toggleColorMode : () => {}
});

export const useMode = () => {
    const [mode, setMode] = useState("dark");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => 
                setMode((prev) => (prev === "light" ? "dark" : "light"))
        }),
        []
    );

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return [theme, colorMode];

}