import { Avatar, Button, IconButton, InputAdornment, TextField, Typography, useMediaQuery } from '@mui/material'
import { Box } from '@mui/system'
import { Formik } from 'formik'
import { useRef, useState } from 'react'
import * as yup from 'yup'
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { PhotoCamera } from '@mui/icons-material';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'
import SocialMediaButtons from '../../components/SocialMediaButtons'
import Notification from '../../components/Notification'

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
}

const registerSchema = yup.object().shape({
    firstName: yup.string().required('This field is required'),
    lastName: yup.string().required('This field is required'),
    email: yup.string().email('Invalid email').required('This field is required'),
    password: yup.string().required('This field is required')
});

const SignIn = () => {

    const [imageUpload, setImageUpload] = useState();
    const { createUser } = UserAuth();
    const fileInput = useRef();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [error, setError] = useState({});
    
    const handleSubmit = async (values, {resetForm}) => {
        // await createUser(values.firstName, values.lastName, values.email, values.password, imageUpload);
        await createUser(values.firstName, values.lastName, values.email, values.password, fileInput.current.files[0]).then((res) => {
            resetForm();
            setError({
                status: 'success',
                message: res
            });
            navigate("/");
            // (res === true) ? navigate("/") : event.preventDefault();
        }).catch((err) => {
            setError({
                status: 'error',
                message: err.message
            });
        });
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleUploadImage = (fileInput) => {
        const image = fileInput.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUpload(reader.result);
        }

        if (image) {
            reader.readAsDataURL(image);
        } else {
            setImageUpload(null);
        }
    };

    const isNonMobile = useMediaQuery("(min-width:600px)");

    return (
        <Box position='relative'>
            <Notification status={error.status} message={error.message} />
            <Typography variant='h1' textAlign='center' mb={3} mt={9}>Sign In</Typography>
            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={registerSchema}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
                    <form onSubmit={handleSubmit}>
                        <Box 
                            display="grid" 
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4"}
                            }}
                        >
                            <TextField 
                                fullWidth
                                variant='outlined'
                                type='text'
                                label='First Name'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.firstName}
                                inputProps={{style: {textTransform: 'capitalize'}}}
                                name='firstName'
                                error={!!touched.firstName && !!errors.firstName}
                                helperText={touched.firstName && errors.firstName}
                                sx={{
                                    gridColumn: 'span 2'
                                }}
                            />
                            <TextField
                                fullWidth
                                variant='outlined'
                                type='text'
                                label='Last Name'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.lastName}
                                inputProps={{style: {textTransform: 'capitalize'}}}
                                name='lastName'
                                error={!!touched.lastName && errors.lastName}
                                helperText={touched.lastName && errors.lastName}
                                sx={{
                                    gridColumn: 'span 2'
                                }}
                            />
                            <TextField 
                                fullWidth
                                variant='outlined'
                                type='email'
                                label='Email'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name='email'
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                sx={{
                                    gridColumn: 'span 3'
                                }}
                            />
                            
                            { imageUpload && (
                                <Avatar 
                                    src={imageUpload}
                                    alt={imageUpload.name}
                                    sx={{ width: 56, height: 56, cursor: 'pointer', marginLeft: 'auto', marginRight: 'auto' }}
                                    onClick={() => fileInput.current.click()}
                                />
                            )}

                            <IconButton 
                                color='secondary' 
                                aria-label='upload picture' 
                                component='label' 
                                sx={{
                                    gridColumn: 'span 1',
                                    display: imageUpload ? 'none' : 'inline-flex'
                                }}
                            >
                                <input hidden ref={fileInput} accept='image/*' type='file' name="img_profile" onChange={handleUploadImage}/>
                                <PhotoCamera />
                            </IconButton>

                            <TextField
                                fullWidth
                                variant='outlined'
                                type={ showPassword ? 'text' : 'password'}
                                label='Password'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name='password'
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                sx={{
                                    gridColumn: 'span 4'
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <IconButton
                                                aria-label='Toggle password visibility'
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                { showPassword ? <VisibilityOff /> : <Visibility /> }
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                            <Box mt={2}>
                                <Button type='submit' color='warning' sx={{ color: '#fff'}} variant='contained' fullWidth endIcon={<LoginIcon/>}>
                                    Sign In
                                </Button>
                            </Box>
                        <Box>
                            <SocialMediaButtons />
                        </Box>
                    </form>
                )}
            </Formik>
            <Box display='flex' flexDirection='column' alignItems='end' mt={1}>
                <Button href='/Login'>
                    Log In
                </Button>
            </Box>
        </Box>
    )
}

export default SignIn