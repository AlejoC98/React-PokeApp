import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import {List, ListItem, ListItemAvatar, ListItemText, Avatar} from '@mui/material';
import { getDocsFirebase } from '../context/FirebaseContext';
import { Box } from '@mui/material';

// Define the styled input base component
const SearchBar = styled('div')(({ theme }) => ({
    display: 'flex',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor:
        theme.palette.mode === "dark" ? alpha(theme.palette.common.white, 0.15) : '#191a26',
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

const SearchInput = styled(InputBase)(({ theme }) => ({
    width: 250,
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
                width: 270,
            },
        },
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

const SearchInputTem = forwardRef((props, ref) => (
    <SearchInput
    placeholder="Search..."
    {...props}
  />
  ));

// Memoized SearchInput component to prevent unnecessary re-renders
const MemoizedSearchInput = React.memo(SearchInputTem);

const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef(null); // Create a ref for the input element
  const [resultData, setResultData] = useState([]);
  const [searchResultClass, setSearchResultClass] = useState('none');

  // Event handler for when the search value changes
  const handleSearchChange = async(event) => {
    setSearchValue(event.target.value);

    if (event.target.value !== '') {
        // Do something with the updated search value
        
    } else {
        setResultData([]);
        setSearchResultClass('animate__fadeOutUp');
    }
  };

  useEffect(() => {
    getDocsFirebase().then((res) => {
        setResultData(res);
        // res.length > 0 ? setSearchResultClass('animate__fadeInDown') : setSearchResultClass('animate__fadeOutUp');
    }).catch((err) => {
        console.log(err);
    });
  }, []);

  // Function to manually set focus on the input element
  const handleInputFocus = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <SearchBar sx={{ backgroundColor: '#555566'}}>
        <SearchIconWrapper onClick={handleInputFocus}>
          <SearchIcon />
        </SearchIconWrapper>
        <MemoizedSearchInput
          value={searchValue}
          onChange={handleSearchChange}
          inputRef={inputRef} // Pass the ref to the input element
        />
        <Box className={`animate__animated ${searchResultClass}`} position='absolute' backgroundColor='#555566' top={40} width='100%' borderRadius={1}>
                <List>
                    {resultData.length > 0 ? resultData.map((user, ind) => (
                        <ListItem key={`result-${ind}`}>
                            <ListItemAvatar>
                                <Avatar
                                    src={user.profile}
                                />
                            </ListItemAvatar>
                            <ListItemText primary={`${user.firstname} ${user.lastname}`} secondary={user.email} />
                        </ListItem>
                    )) : (
                        <ListItem>
                            <ListItemText primary='What are you looking for?' />
                        </ListItem>
                    )}
                </List>
            </Box>
      </SearchBar>
    </div>
  );
};

export default App;
