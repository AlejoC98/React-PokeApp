import { Box, useTheme } from "@mui/material";
import { tokens, ColorModeContext } from "../../theme";

const LeftBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.pallet.mode);
  const colorMode = useContext(ColorModeContext);
  return (
    <Box display="fixed" l={30} w={200} backgroundColor={colors.orange[900]}>
      lorem
    </Box>
  )
}

export default LeftBar