import { ListItem, ListItemButton, List, useTheme, ListItemIcon, ListItemAvatar, Avatar } from "@mui/material";
import { Box } from "@mui/material";
import { tokens } from "../../theme";
// Icons
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import StyleIcon from '@mui/icons-material/Style';
import GroupIcon from '@mui/icons-material/Group';

const LeftBar = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display="fixed" width={75} left={10} position="relative" borderRadius={2} zIndex={10000} height="97%" backgroundColor={colors.spacecadet[600]} m="auto">
      <List sx={{ display: "inline-flex", flexDirection: "column"}}>
        <ListItem sx={{ padding: 0, display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 3, marginTop: 2}}>
          <ListItemAvatar sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar src="/static/images/pokeball.png" />
          </ListItemAvatar>
        </ListItem>
        {[<VideogameAssetIcon/>, <StyleIcon/>, <GroupIcon/>].map((icon, index) => {
          return (
            <ListItem key={index} disablePadding>
            <ListItemButton sx={{ padding: 1}}>
              <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', color: "#ffffff"}}>
                { icon }
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          );
        })}
      </List>
    </Box>
  )
}

export default LeftBar