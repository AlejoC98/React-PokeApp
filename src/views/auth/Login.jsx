import { Box, TextField, Button, InputAdornment, IconButton } from '@mui/material'
import React from 'react';
// import { useTheme } from '@mui/material';
// import { tokens } from '../../theme';
import { Formik } from 'formik';
import * as yup from "yup";
import useMediaQuery from '@mui/material/useMediaQuery';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const initialValues = {
  username: "",
  password: ""
}

const accountSchema = yup.object().shape({
  username: yup.string().email("Invalid email").required("This field is required"),
  password: yup.string().required("This field is required"),
});

const Login = () => {

  const navigate = useNavigate();
  const { signIn } = UserAuth();

  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  
  const handleFormSubmit = async(values) => {
    await signIn(values.username, values.password).then(() => {
      navigate("/Dashboard");
    }).catch((err) => {
      console.log(err);
    });
  }

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box>
      <h1 style={{ textAlign: 'center'}}>Login</h1>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={accountSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
              }}
            >
              <TextField
                fullWidth
                variant='outlined'
                type="email"
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={!!touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                sx={{
                  gridColumn: "span 4"
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PersonIcon />
                    </InputAdornment>
                  )
                }}

              />

              <TextField
                fullWidth
                variant='outlined'
                type={showPassword ? 'text' : 'password'}
                name='password'
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{
                  gridColumn: "span 4"
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Box mt={2}>
              <Button type='submit' color='secondary' variant='contained' endIcon={<LoginIcon />} fullWidth>
                Log In
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Box display="flex" color="primary" flexDirection="column" alignItems='end' mt={1}>
        <Button href='/SignIn'>
          Sign In
        </Button>
        <Button href='/Recovery'>
          Forgot Password?
        </Button>
      </Box>
    </Box>
  )
}

export default Login