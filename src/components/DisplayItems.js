import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Grid, List, ListItem, ListItemButton, ListItemText, Typography, IconButton  } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from './BreadCrumb';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import GradeIcon from '@mui/icons-material/Grade';
import { updateFavorites } from '../context/FirebaseContext';
import { styled } from '@mui/material/styles';
// import { GetCardSet } from '../context/PokemonContext';

const ViewButtons = styled(Button)(() => ({
    backgroundColor: '#c4cecb', 
    color: '#fff', 
    border: `1px solid #7d8b87`, 
    borderRadius: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover' : {
        backgroundColor: '#ebefee'
    }
}));

const DisplayItems = ({ data, display = 'list-view', breadcrumb = true}) => {

    const [active, setActive] = useState(display);

    const [favoritesDisplay, setFavoritesDisplay] = useState([]);
    const [favoritesUpdate, setFavoritesUpdate] = useState([]);

    const navigate = useNavigate();

    const handleActive = (btn) => {
        if (active !== btn)
            setActive(btn);
    }

    const handleOpen = (item) => {

        if (window.location.pathname.includes('CardSet')) {
            navigate(window.location.pathname + '/' + item.name)
        } else {
            'cardset_id' in item ? navigate('/CardSet/' + item.setname + '/' + item.name) : navigate('/CardSet/' + item.name);
        }
    }

    const handleFavorite = (ele) => {
        let current = favoritesDisplay.indexOf(ele);
        let insert;
        if (current !== -1) {
            insert = [...favoritesDisplay.splice(current,  1)];
        } else {
            insert = [ele];
            setFavoritesDisplay([...favoritesDisplay, ele]);
        }
        setFavoritesUpdate(insert);
    }

    useEffect(() => {
        updateFavorites(favoritesUpdate).then((res) => {
            if (res.length > 0)
                setFavoritesDisplay(res);
        }).catch((err) => {
            console.log(err);
        });
    }, [favoritesUpdate]);

    return (
        <Box>
            <Box display='flex' justifyContent={breadcrumb ? 'center' : 'end'} alignItems='center' mb={4}>
                {breadcrumb === true && (
                    <BreadCrumb />
                )}
                <Box display='flex' justifyContent='space-around' width={150}>
                    <ViewButtons className={active === 'list-view' ? 'active' : ''}  onClick={() => handleActive('list-view')}>
                        <ViewListIcon />
                    </ViewButtons>
                    <ViewButtons className={active === 'grid-view' ? 'active' : ''} onClick={() => handleActive('grid-view')}>
                        <ViewModuleIcon />
                    </ViewButtons>
                </Box>
            </Box>
            
            { active === 'list-view' ? (
                <Grid container spacing={4}>
                    {data.map((element) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={element.id}>
                            <Card sx={{
                                height: 180,
                                ':hover > .fav-btn': {
                                    display: 'inline-flex !important'
                                }
                            }}>
                                <IconButton  
                                    color='warning' 
                                    className='fav-btn' 
                                    onClick={() => handleFavorite(element.id)}
                                    sx={{
                                        display: favoritesDisplay.includes(element.id) ? 'inline-flex' : 'none'
                                    }}
                                >
                                    {favoritesDisplay.includes(element.id) ? (
                                        <GradeIcon />
                                    ) : (
                                        <StarBorderIcon />
                                    )}
                                </IconButton >
                                <CardActionArea onClick={() => handleOpen(element)} sx={{ height: '100%'}}>
                                    <CardMedia 
                                        component='img'
                                        alt={element.name}
                                        height={100}
                                        image={'profile' in element ? element.profile : 'logo' in element.images ? element.images.logo : element.images.small}
                                        sx={{ objectFit: 'contain', padding: '0.5em'}}
                                    />
                                    <CardContent>
                                    <Typography variant='h3' sx={{ textAlign: 'center'}}>
                                        { element.name }
                                    </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <List sx={{
                    '& li': {
                        padding: '0 !important'
                    }
                }}>
                    { data.map((element) => (
                        <ListItem key={element.id} className='list-items'>
                            <Button 
                                color='warning' 
                                className='fav-btn' 
                                onClick={() => handleFavorite(element.id)} 
                                sx={{
                                    display: favoritesDisplay.includes(element.id) ? 'block' : 'none',
                                    position: 'relative !important'
                                }}
                            >
                                { favoritesDisplay.includes(element.id) ? (
                                    <GradeIcon />
                                    ) : (
                                    <StarBorderIcon />
                                ) }
                            </Button>
                            <ListItemButton sx={{ padding: '8px 5px', left: favoritesDisplay.includes(element.id) ? 0 : 65}} onClick={() => handleOpen(element)}>
                                <ListItemText>{element.name}</ListItemText>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}

        </Box>
    )
}

export default DisplayItems
