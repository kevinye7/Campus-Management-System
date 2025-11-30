/*==================================================
RegisterAssociationView.js

View for public association registration.
================================================== */
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '20px',
  },
  formContainer: {
    width: '100%',
    maxWidth: '500px',
  },
  formTitle: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  formField: {
    marginBottom: '20px',
  },
  submitButton: {
    marginTop: '10px',
  },
  loginLink: {
    marginTop: '15px',
    textAlign: 'center',
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
      <Card className={classes.formContainer}>
        <CardContent>
          <Typography variant="h4" component="h1" className={classes.formTitle} gutterBottom>
            Create Association
          </Typography>
          
          <Typography variant="body2" color="text.secondary" style={{ marginBottom: '20px', textAlign: 'center' }}>
            Create a new association and become its administrator
          </Typography>
          
          {error && (
            <Alert severity="error" style={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleFormSubmit}>
            <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px' }}>
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

            <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px' }}>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterAssociationView;

