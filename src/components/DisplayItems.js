import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, ListItem, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from './BreadCrumb';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import GradeIcon from '@mui/icons-material/Grade';
import { updateFavorites } from '../context/FirebaseContext';
// import { GetCardSet } from '../context/PokemonContext';

const DisplayItems = ({ data, display = 'list-view', module = ''}) => {

    const [active, setActive] = useState(display);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [favoritesDisplay, setFavoritesDisplay] = useState([]);
    const [favoritesUpdate, setFavoritesUpdate] = useState([]);

    const navigate = useNavigate();

    const handleActive = (btn) => {
        if (active !== btn)
            setActive(btn);
    }

    const handleOpen = (setId) => {
        navigate(window.location.pathname + '/' + setId);
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

    const ItemsList = () => {
        const ItemsLoop = [];
        if (data !== undefined) {
            data.forEach((element, index) => {
                // ItemsLoop.push(<p>{element.name}</p>);
                ItemsLoop.push(
                    <ListItem key={index} sx={{ padding: 0}}>
                        <Button color='warning' className='fav-btn' onClick={() => handleFavorite(element.id)}>
                            { favoritesDisplay.includes(element.id) ? (
                                <GradeIcon />
                                ) : (
                                <StarBorderIcon />
                            ) }
                        </Button>
                        <ListItemButton sx={{ padding: '8px 0'}} onClick={() => handleOpen(element.id, element.name)}>
                            <ListItemText>{element.name}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                );
            });

            return (
                <Box>
                    { ItemsLoop}
                </Box>
            );
        }
    }

    const ItemsGrid = () => {
        const ItemsLoop = [];
        if (data !== undefined) {
            data.forEach((element, index) => {
                // ItemsLoop.push(<p>{element.name}</p>);
                ItemsLoop.push(
                    <Card key={index} sx={{ width: 250, margin: 1, position: 'relative'}}>
                            <Button color='warning' className='fav-btn' onClick={() => handleFavorite(element.id)} sx={{ position: 'absolute', right: 0}}>
                                { favoritesDisplay.includes(element.id) ? (
                                    <GradeIcon />
                                    ) : (
                                    <StarBorderIcon />
                                ) }
                            </Button>
                        <CardActionArea sx={{ height: '100%'}} onClick={() => handleOpen(element.id, element.name)}>
                            <CardMedia
                                component='img'
                                alt={element.name}
                                height={100}
                                image={'logo' in element.images ? element.images.logo : element.images.small}
                                sx={{ objectFit: 'contain', padding: '0.5em'}}
                            />
                            <CardContent>
                                <Typography variant='h3' sx={{ textAlign: 'center'}}>
                                    {element.name}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                );
            });

            return (
                <Box display='flex' justifyContent='space-around' minHeight='100vh' flexWrap='wrap'>
                    { ItemsLoop }
                </Box>
            );
        }
    }

    return (
        <Box 
            position='relative'
            width='100%'
        >
            <Box 
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                width='100%'
            >
                <BreadCrumb name={module} />
                <Box display='flex' justifyContent='space-between' width={75}>
                    <button 
                        className={active === 'list-view' ? 'active' : ''} 
                        style={{ 
                            backgroundColor: colors.gray[300], 
                            color: '#fff', 
                            border: `1px solid ${colors.gray[600]}`, 
                            borderRadius: 3, 
                            cursor: active === 'list-view' ? 'default' : 'pointer',
                            '&:hover' : {
                                backgroundColor: colors.gray[100]
                            }
                        }} 
                        onClick={() => handleActive('list-view')}
                    >
                        <ViewListIcon />
                    </button>
                    <button 
                        className={active === 'grid-view' ? 'active' : ''} 
                        id='grid-view' 
                        style={{ 
                            backgroundColor: colors.gray[300], 
                            color: '#fff', 
                            border: `1px solid ${colors.gray[600]}`, 
                            borderRadius: 3, 
                            cursor: active === 'grid-view' ? 'default' : 'pointer',
                            '&:hover' : {
                                backgroundColor: colors.gray[100]
                            }
                        }} 
                        onClick={() => handleActive('grid-view')}
                    >
                        <ViewModuleIcon />
                    </button>
                </Box>            
            </Box>            
                { active === 'list-view' ? (
                    <ItemsList />
                ) : (
                    <ItemsGrid />
                ) }            
        </Box>
    )
}

export default DisplayItems
