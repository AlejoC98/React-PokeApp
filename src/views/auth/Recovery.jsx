import { Box, Button, TextField, useMediaQuery } from '@mui/material'
import { Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'
import SendIcon from '@mui/icons-material/Send';

const initialValues = {
    email: ''
}

const recoverySchema = yup.object().shape({
    email: yup.string().email("Invalid email").required('This field is required')
});

const Recovery = () => {

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleSubmit = (values) => {
        console.log(values);
    }

  return (
    <Box>
        <h1 style={{ textAlign: 'center' }}>Recovery Password</h1>
        <Formik
            onSubmit={handleSubmit}
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
                            type='email'
                            label='Email'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            name='username'
                            error={!!touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                            sx={{
                                gridColumn: 'span 4'
                            }}
                        />
                    </Box>
                    <Box mt={2}>
                        <Button type='submit' color='secondary' variant='contained' endIcon={<SendIcon />} fullWidth>
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