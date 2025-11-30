/*==================================================
EditCampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the edit campus page.
================================================== */
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';

// Create styling for the input form
const useStyles = makeStyles( () => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  },
  formContainer:{  
    width: '100%',
    maxWidth: '600px',
  },
  formTitle:{
    marginBottom: '20px',
  },
  formField: {
    marginBottom: '20px',
  },
  submitButton: {
    marginTop: '10px',
  },
}));

const EditCampusView = (props) => {
  const {handleChange, handleSubmit, campus, errors, formData } = props;
  const classes = useStyles();

  // Use formData if available (from container state), otherwise use campus prop
  const currentData = formData || {
    name: campus?.name || '',
    address: campus?.address || '',
    description: campus?.description || '',
    imageUrl: campus?.imageUrl || ''
  };

  // Render an Edit Campus view with an input form
  return (
    <div className={classes.root}>
      <Card className={classes.formContainer}>
        <CardContent>
          <Typography variant="h4" component="h1" className={classes.formTitle} gutterBottom>
            Edit Campus Information
          </Typography>
          <form onSubmit={(e) => handleSubmit(e)}>
            <TextField
              fullWidth
              label="Campus Name"
              name="name"
              value={currentData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              className={classes.formField}
            />

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={currentData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
              required
              className={classes.formField}
            />

            <TextField
              fullWidth
              label="Description (optional)"
              name="description"
              multiline
              rows={4}
              value={currentData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              className={classes.formField}
            />

            <TextField
              fullWidth
              label="Image URL (optional)"
              name="imageUrl"
              value={currentData.imageUrl}
              onChange={handleChange}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl}
              className={classes.formField}
            />

            <Box className={classes.submitButton}>
              <Button variant="contained" color="primary" type="submit" fullWidth size="large">
                Submit
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </div>    
  )
}

export default EditCampusView;

