/*==================================================
AllStudentsView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the all students view page.
================================================== */
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  studentCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  studentImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '15px',
  },
  cardContent: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },
}));

const AllStudentsView = (props) => {
  const {students, deleteStudent} = props;
  const classes = useStyles();
  
  // If there is no student, display a message
  if (!students.length) {
    return (
      <div className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h3" component="h1">
            All Students
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/newstudent"
          >
            Add New Student
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          There are no students.
        </Typography>
      </div>
    );
  }
  
  // If there is at least one student, render All Students view 
  return (
    <div className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h3" component="h1">
          All Students
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/newstudent"
        >
          Add New Student
        </Button>
      </Box>

      <Grid container spacing={3}>
        {students.map((student) => {
          const name = student.firstname + " " + student.lastname;
          return (
            <Grid item xs={12} sm={6} md={4} key={student.id}>
              <Card className={classes.studentCard}>
                <CardContent className={classes.cardContent}>
                  {student.imageUrl && (
                    <img 
                      src={student.imageUrl} 
                      alt={name} 
                      className={classes.studentImage}
                    />
                  )}
                  <Box style={{ flexGrow: 1 }}>
                    <Typography 
                      variant="h6" 
                      component={Link} 
                      to={`/student/${student.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {name}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="error"
                    onClick={() => deleteStudent(student.id)}
                    aria-label="delete student"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default AllStudentsView;