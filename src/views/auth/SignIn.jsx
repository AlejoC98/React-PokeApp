import { Button, IconButton, InputAdornment, TextField, useMediaQuery } from '@mui/material'
import { Box } from '@mui/system'
import { Formik } from 'formik'
import { useState } from 'react'
import * as yup from 'yup'
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { PhotoCamera } from '@mui/icons-material';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom'

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

    const navigate = useNavigate();

    const handleSubmit = async (values, event) => {
        // await createUser(values.firstName, values.lastName, values.email, values.password, imageUpload);
        await createUser(values.firstName, values.lastName, values.email, values.password, imageUpload).then((res) => {
            (res === true) ? navigate("/") : event.preventDefault();            
        }).catch((err) => {
            console.log(err);
        });
    }

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleUploadImage = (fileInput) => {
        setImageUpload(fileInput.target.files[0]);
    };

    const isNonMobile = useMediaQuery("(min-width:600px)");

    return (
        <Box>
            <h1 style={{ textAlign: 'center' }}>Sign In</h1>
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
                            
                            <IconButton color='secondary' aria-label='upload picture' component='label' sx={{
                                gridColumn: 'span 1'
                            }}>
                                <input hidden accept='image/*' type='file' name="img_profile" onChange={handleUploadImage}/>
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
                            <Button type='submit' color='secondary' variant='contained' fullWidth endIcon={<LoginIcon/>}>
                                Sign In
                            </Button>
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