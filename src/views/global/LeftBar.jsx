import { ListItem, List, useTheme, ListItemIcon, ListItemAvatar, Avatar, MenuItem, alpha } from "@mui/material";
import { Box } from "@mui/material";
import { tokens } from "../../theme";
// Icons
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import StyleIcon from '@mui/icons-material/Style';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import { useState } from "react";
import { Link } from "react-router-dom";

const Item = ({ title, to, icon, selected, setSelected}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem 
      component={Link} 
      to={to} 
      selected={selected === title} 
      onClick={() => setSelected(title)}
      sx={{
        "&.Mui-selected" : { backgroundColor: alpha(colors.orange[500], 0.25) }
      }}
    >
      <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', color: "#ffffff", padding: 1}}>
        { icon }
      </ListItemIcon>
    </MenuItem>
  )
}

const LeftBar = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box display="fixed" width={75} left={10} position="relative" borderRadius={2} zIndex={10000} height="97%" backgroundColor={theme.palette.mode === 'dark' ? colors.spacecadet[600] : colors.spacecadet[500]} m="auto">
      <List sx={{ display: "inline-flex", flexDirection: "column"}}>
        <ListItem sx={{ padding: 0, display: 'flex', justifyContent: 'center', width: '100%', marginBottom: 3, marginTop: 2}}>
          <ListItemAvatar sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar src="/static/images/pokeball.png" />
          </ListItemAvatar>
        </ListItem>
        <Item
          title="Dashboard"
          to="/Dashboard"
          icon={<HomeIcon />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Game"
          to="/Game"
          icon={<VideogameAssetIcon />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Card Set"
          to="/CardSet"
          icon={<StyleIcon />}
          selected={selected}
          setSelected={setSelected}
        />
        <Item
          title="Friends"
          to="/Friends"
          icon={<GroupIcon />}
          selected={selected}
          setSelected={setSelected}
        />
      </List>
    </Box>
  )
}

export default LeftBar