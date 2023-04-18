import { Box, Button, TextField, useMediaQuery } from '@mui/material'
import { Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'
import SendIcon from '@mui/icons-material/Send';
import { UserAuth } from '../../context/AuthContext';

const initialValues = {
    username: ''
}

const recoverySchema = yup.object().shape({
    username: yup.string().email("Invalid email").required('This field is required')
});

const Recovery = () => {

    const { recoveryPassword } = UserAuth();

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = async(values, { resetForm }) => {
        await recoveryPassword(values.username).then(() => {
            // We need to call notification function
            console.log('Password sent');
            resetForm();
        }).catch((err) => {
            console.log(err);
        });
    }

  return (
    <Box>
        <h1 style={{ textAlign: 'center' }}>Recovery Password</h1>
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={recoverySchema}
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit}) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        display='grid'
                        gap='30px'
                        gridTemplateColumns='repeat(4, minmax(0, 1fr))'
                        sx={{
                            "& > div": { gridColumn: isNonMobile ? undefined : 'span 4'}
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
                        />
                    </Box>
                    <Box mt={2}>
                        <Button type='submit' color='warning' sx={{ color: '#fff'}} variant='contained' endIcon={<SendIcon />} fullWidth>
                            Send email
                        </Button>
                    </Box>
                </form>
            )}
        </Formik>
        <Box display='flex' justifyContent='end' mt={1}>
            <Button href='/Login'>
                Back
            </Button>
        </Box>
    </Box>
  )
}

export default Recovery