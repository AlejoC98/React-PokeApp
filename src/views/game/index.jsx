import { Box, Grid } from "@mui/material";
import { useReducer } from "react";
import { useLocation } from "react-router-dom";
import {gameReducer , initialValues } from "../../reducers/gameReducer";
import { GridItem } from "../../theme";
import CardsElements from "../../components/CardsElements";

const Game = () => {

    const location = useLocation();

    const [state, dispatch] = useReducer(gameReducer, initialValues);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <GridItem>
                    <Box className='board'>
                        <CardsElements 
                            data={state}
                            dispatch={dispatch}
                        />
                    </Box>
                </GridItem>
            </Grid>
        </Grid>
    );
}

export default Game