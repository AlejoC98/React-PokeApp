import React, { useState, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import {List, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemButton, IconButton} from '@mui/material';
import { getSearchDocs } from '../context/FirebaseContext';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

// Sarchbar Styles
const Search = styled('div')(({ theme }) => ({
    display: 'flex',
    position: 'relative',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.15) : '#191a26',
    '&:hover': {
      backgroundColor: theme.palette.mode === "dark" ? '#555566' : '#222233',
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '30ch',
        },
      },
    },
  }));

const App = () => {

  const [data, setData] = useState();
  const [result, setResult] = useState([]);
  const [displayRes, setDisplayRes] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getSearchDocs().then((res) => {
        setData(res);
    }).catch((err) => {
        console.log(err);
    })
  }, []);

  const handleSearch = (event) => {
    if (data && data.length > 0) {
        if (event.target.value !== '') {
            let res = data.filter(d => {
              const { profile, ...rd} = d;
              return Object.values(rd).find(r => r.toLowerCase().includes(event.target.value.toLowerCase()));
            });
            if (res !== undefined)
              setResult(res);
        } else {
            setResult([]);
        }

      }
  }

  const handleClick = (item) => {
    setDisplayRes(false);

    if ('setname' in item)
      navigate(`/CardSet/${item.setname}/${item.name}`);
    else if ('firstname' in item)
      navigate(`/Dashboard/${item.firstname + ' ' + item.lastname}`, {state : { data: item}});
    else
      navigate(`/CardSet/${item.name}`);

    // navigate(window.location.pathname + '/' + [item.setname, item.name].join('/'));

    // console.log("Socio", item);
  }

  return (
    <Box>
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search.." aria-label="search" onChange={handleSearch} onFocus={() => setDisplayRes(true)}/>
            <IconButton onClick={() => setDisplayRes(false)}>
              <CloseIcon />
            </IconButton>
            { displayRes ? (
                <Box 
                    position='absolute' 
                    top={40} 
                    backgroundColor='#7f808c' 
                    width='100%' 
                    p={1} 
                    borderRadius={1}
                    maxHeight={300}
                    sx={{
                      overflowX: 'hidden',
                      overflowY: 'scroll'
                    }}
                >
                    <List>
                        { result.length > 0 ? result.map((res, ind) => (
                            <ListItemButton key={`result-${ind}`} onClick={() => handleClick(res)}>
                                <ListItemAvatar>
                                    <Avatar 
                                        src={res.profile}
                                    />
                                </ListItemAvatar>
                                { 'firstname' in res ? (
                                  <ListItemText primary={`${res.firstname} ${res.lastname}`} secondary={res.email} />
                                  ) : (
                                    <ListItemText primary={`${res.name}`} secondary={'series' in res ? res.series : res.setname} />
                                )}
                            </ListItemButton>
                        )) : (
                            <ListItem>
                                <ListItemText>
                                    What are you looking for?
                                </ListItemText>
                            </ListItem>
                        ) }
                    </List>
                </Box>
            ) : (
                <Box></Box>
            )}
        </Search>
    </Box>
  );
};

export default App;
