/*==================================================
LoginView.js

The Views component for user login.
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
    maxWidth: '400px',
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
      <Card className={classes.formContainer}>
        <CardContent>
          <Typography variant="h4" component="h1" className={classes.formTitle} gutterBottom>
            Login
          </Typography>
          
          {error && (
            <Alert severity="error" style={{ marginBottom: '20px' }}>
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginView;

