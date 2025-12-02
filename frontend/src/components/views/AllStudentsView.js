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

const useStyles = makeStyles(theme => ({
  root: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  headerTitle: {
    color: '#1d1d1f',
    fontWeight: 600,
    fontSize: 'clamp(24px, 5vw, 36px)',
  },
  addButton: {
    background: '#1d1d1f !important',
    color: 'white !important',
    borderRadius: '10px !important',
    padding: '10px 20px !important',
    fontWeight: 500,
    textTransform: 'none',
    '&:hover': {
      background: '#000000 !important',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
    },
  },
  studentCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(0, 0, 0, 0.12)',
    },
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
    padding: '20px !important',
  },
  studentName: {
    color: '#1d1d1f',
    fontWeight: 500,
    textDecoration: 'none !important',
    '&:hover': {
      color: '#000000',
    },
  },
  emptyText: {
    color: '#666666',
    textAlign: 'center',
    padding: '40px',
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
          <Typography variant="h3" component="h1" className={classes.headerTitle}>
            All Students
          </Typography>
          <Button
            className={classes.addButton}
            startIcon={<AddIcon />}
            component={Link}
            to="/newstudent"
          >
            Add New Student
          </Button>
        </Box>
        <Typography variant="body1" className={classes.emptyText}>
          There are no students.
        </Typography>
      </div>
    );
  }
  
  // If there is at least one student, render All Students view 
  return (
    <div className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h3" component="h1" className={classes.headerTitle}>
          All Students
        </Typography>
        <Button
          className={classes.addButton}
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
                      className={classes.studentName}
                    >
                      {name}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions style={{ padding: '0 20px 20px 20px' }}>
                  <IconButton
                    onClick={() => deleteStudent(student.id)}
                    aria-label="delete student"
                    style={{ color: '#666666' }}
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