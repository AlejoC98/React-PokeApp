import { Box, Button, Grid } from "@mui/material";
import { useEffect, useReducer } from "react";
import { useLocation } from "react-router-dom";
import gameReducer from "../../reducers/gameReducer";
import { GridItem } from "../../theme";

const Game = () => {

    const location = useLocation();

    const [state, dispatch] = useReducer(gameReducer, location.state.data);

    useEffect(() => {
        dispatch({ type: 'GET_CARDS'});
        console.log(state);
    }, []);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <GridItem>
                    <Box className='board'>
                        locaasd
                    </Box>
                </GridItem>
            </Grid>
        </Grid>
    );
}

export default Game