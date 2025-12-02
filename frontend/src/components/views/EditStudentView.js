/*==================================================
EditStudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the edit student page.
================================================== */
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';

// Create styling for the input form
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  },
  formContainer:{  
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
    },
  },
  formTitle:{
    marginBottom: '30px',
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
        borderColor: 'rgba(0, 0, 0, 0.2)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1d1d1f',
      },
    },
  },
  submitButton: {
    marginTop: '20px',
    '& .MuiButton-root': {
      background: '#1d1d1f !important',
      color: 'white !important',
      borderRadius: '10px !important',
      padding: '12px 24px !important',
      fontWeight: 500,
      textTransform: 'none',
      '&:hover': {
        background: '#000000 !important',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
      },
    },
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
      <div className={classes.formContainer}>
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
      </div>
    </div>    
  )
}

export default EditStudentView;

