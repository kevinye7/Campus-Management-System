/*==================================================
EditStudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the edit student page.
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

const EditStudentView = (props) => {
  const {handleChange, handleSubmit, student, errors, formData } = props;
  const classes = useStyles();

  // Use formData if available (from container state), otherwise use student prop
  const currentData = formData || {
    firstname: student?.firstname || '',
    lastname: student?.lastname || '',
    email: student?.email || '',
    imageUrl: student?.imageUrl || '',
    gpa: student?.gpa || '',
    campusId: student?.campusId || student?.campus?.id || ''
  };

  // Render an Edit Student view with an input form
  return (
    <div className={classes.root}>
      <Card className={classes.formContainer}>
        <CardContent>
          <Typography variant="h4" component="h1" className={classes.formTitle} gutterBottom>
            Edit Student Information
          </Typography>
          <form onSubmit={(e) => handleSubmit(e)}>
            <TextField
              fullWidth
              label="First Name"
              name="firstname"
              value={currentData.firstname}
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
              value={currentData.lastname}
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
              value={currentData.email}
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
              value={currentData.imageUrl}
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
              value={currentData.gpa}
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
              value={currentData.campusId}
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

export default EditStudentView;

