/*==================================================
LoginView.js

The Views component for user login.
================================================== */
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
    padding: '20px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '450px',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)',
    padding: '30px',
    [theme.breakpoints.down('xs')]: {
      padding: '20px',
      maxWidth: '100%',
    },
  },
  formTitle: {
    marginBottom: '30px',
    textAlign: 'center',
    color: '#1d1d1f',
    fontWeight: 600,
    fontSize: 'clamp(24px, 5vw, 32px)',
  },
  formField: {
    marginBottom: '20px',
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.5)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.8)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(0, 0, 0, 0.7)',
    },
  },
  submitButton: {
    marginTop: '20px',
    '& .MuiButton-root': {
      background: '#1d1d1f !important',
      border: '1px solid #1d1d1f !important',
      color: 'white !important',
      borderRadius: '10px !important',
      padding: '12px 24px !important',
      fontWeight: 500,
      fontSize: '16px',
      textTransform: 'none',
      transition: 'all 0.3s ease !important',
      '&:hover': {
        background: '#000000 !important',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
      },
    },
  },
  signupLink: {
    marginTop: '20px',
    textAlign: 'center',
    '& a': {
      color: '#1d1d1f',
      textDecoration: 'none',
      fontWeight: 500,
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    '& .MuiTypography-root': {
      color: '#666666',
    },
  },
  alert: {
    borderRadius: '12px',
    marginBottom: '20px',
  },
}));

const LoginView = (props) => {
  const { handleChange, handleSubmit, error } = props;
  const classes = useStyles();
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (handleChange) handleChange(e);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (handleSubmit) handleSubmit(formData);
  };

  return (
    <div className={classes.root}>
      <div className={classes.formContainer}>
        <Typography variant="h4" component="h1" className={classes.formTitle} gutterBottom>
          Login
        </Typography>
        
        {error && (
          <Alert severity="error" className={classes.alert}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleFormSubmit}>
          <TextField
            fullWidth
            label="Username or Email"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className={classes.formField}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className={classes.formField}
          />

          <Box className={classes.submitButton}>
            <Button variant="contained" color="primary" type="submit" fullWidth size="large">
              Login
            </Button>
          </Box>

          <Box className={classes.signupLink}>
            <Typography variant="body2">
              Don't have an account? <Link to="/register">Create an association</Link>
            </Typography>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default LoginView;

