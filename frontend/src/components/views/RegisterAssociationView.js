/*==================================================
RegisterAssociationView.js

View for public association registration.
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
    maxWidth: '600px',
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
    marginBottom: '10px',
    textAlign: 'center',
    color: '#1d1d1f',
    fontWeight: 600,
    fontSize: 'clamp(24px, 5vw, 32px)',
  },
  formSubtitle: {
    marginBottom: '30px',
    textAlign: 'center',
    color: '#666666',
  },
  sectionTitle: {
    marginTop: '20px',
    marginBottom: '15px',
    color: '#1d1d1f',
    fontWeight: 600,
    fontSize: '18px',
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
      '&:disabled': {
        background: 'rgba(0, 0, 0, 0.2) !important',
        color: 'rgba(255, 255, 255, 0.5) !important',
      },
    },
  },
  loginLink: {
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

const RegisterAssociationView = (props) => {
  const { handleChange, handleSubmit, error, loading } = props;
  const classes = useStyles();
  const [formData, setFormData] = useState({
    associationName: '',
    associationDescription: '',
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

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
          Create Association
        </Typography>
        
        <Typography variant="body2" className={classes.formSubtitle}>
          Create a new association and become its administrator
        </Typography>
        
        {error && (
          <Alert severity="error" className={classes.alert}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleFormSubmit}>
          <Typography variant="h6" className={classes.sectionTitle}>
            Association Information
          </Typography>
          
          <TextField
            fullWidth
            label="Association Name"
            name="associationName"
            value={formData.associationName}
            onChange={handleInputChange}
            required
            className={classes.formField}
          />

          <TextField
            fullWidth
            label="Description (optional)"
            name="associationDescription"
            multiline
            rows={2}
            value={formData.associationDescription}
            onChange={handleInputChange}
            className={classes.formField}
          />

          <Typography variant="h6" className={classes.sectionTitle}>
            Your Account (Association Admin)
          </Typography>

          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className={classes.formField}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
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

          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className={classes.formField}
          />

          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className={classes.formField}
          />

          <Box className={classes.submitButton}>
            <Button 
              variant="contained" 
              color="primary" 
              type="submit" 
              fullWidth 
              size="large"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Association'}
            </Button>
          </Box>

          <Box className={classes.loginLink}>
            <Typography variant="body2">
              Already have an account? <Link to="/login">Login here</Link>
            </Typography>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default RegisterAssociationView;

