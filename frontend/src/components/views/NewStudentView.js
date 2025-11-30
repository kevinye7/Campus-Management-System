/*==================================================
NewStudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the new student page.
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

const NewStudentView = (props) => {
  const {handleChange, handleSubmit, errors, formData} = props;
  const classes = useStyles();

  // Render a New Student view with an input form
  return (
    <div className={classes.root}>
      <Card className={classes.formContainer}>
        <CardContent>
          <Typography variant="h4" component="h1" className={classes.formTitle} gutterBottom>
            Add New Student
          </Typography>
          <form onSubmit={(e) => handleSubmit(e)}>
            <TextField
              fullWidth
              label="First Name"
              name="firstname"
              value={formData?.firstname || ''}
              onChange={handleChange}
              error={!!errors.firstname}
              helperText={errors.firstname}
              required
              className={classes.formField}
            />

            <TextField
              fullWidth
              label="Last Name"
              name="lastname"
              value={formData?.lastname || ''}
              onChange={handleChange}
              error={!!errors.lastname}
              helperText={errors.lastname}
              required
              className={classes.formField}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData?.email || ''}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              className={classes.formField}
            />

            <TextField
              fullWidth
              label="Image URL (optional)"
              name="imageUrl"
              value={formData?.imageUrl || ''}
              onChange={handleChange}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl}
              className={classes.formField}
            />

            <TextField
              fullWidth
              label="GPA (optional)"
              name="gpa"
              type="number"
              inputProps={{ step: "0.1", min: "0.0", max: "4.0" }}
              value={formData?.gpa || ''}
              onChange={handleChange}
              error={!!errors.gpa}
              helperText={errors.gpa || "Must be between 0.0 and 4.0"}
              className={classes.formField}
            />

            <TextField
              fullWidth
              label="Campus ID (optional)"
              name="campusId"
              type="number"
              value={formData?.campusId || ''}
              onChange={handleChange}
              error={!!errors.campusId}
              helperText={errors.campusId}
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

export default NewStudentView;