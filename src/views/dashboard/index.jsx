import { Box } from "@mui/material";
import Grid from '@mui/material/Grid';
import { GridItem } from "../../theme";
// import { createFirebaseDocs } from "../../context/FirebaseContext";
// import { useEffect } from "react";

const Dashboard = () => {

  // useEffect(() => {
  //   createFirebaseDocs();
  // }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8} md={6}>
          <GridItem>xs=8</GridItem>
        </Grid>
        <Grid item xs={12} sm={3} md={6}>
          <GridItem>xs=8</GridItem>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
