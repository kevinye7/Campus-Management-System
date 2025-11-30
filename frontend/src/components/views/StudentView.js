/*==================================================
StudentView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the single student view page.
================================================== */
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  studentCard: {
    maxWidth: '600px',
    width: '100%',
  },
  studentImage: {
    height: '400px',
    objectFit: 'cover',
  },
  infoSection: {
    marginTop: '20px',
  },
  infoItem: {
    marginBottom: '15px',
  },
  actionButton: {
    marginTop: '20px',
  },
}));

const StudentView = (props) => {
  const { student } = props;
  const classes = useStyles();
  const name = student.firstname + " " + student.lastname;

  // Render a single Student view 
  return (
    <div className={classes.root}>
      <Card className={classes.studentCard}>
        {student.imageUrl && (
          <CardMedia
            component="img"
            className={classes.studentImage}
            image={student.imageUrl}
            alt={name}
          />
        )}
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom>
            {name}
          </Typography>
          
          <Box className={classes.infoSection}>
            <Typography variant="body1" className={classes.infoItem}>
              <strong>Email:</strong> {student.email}
            </Typography>
            
            {student.gpa !== null && student.gpa !== undefined && (
              <Typography variant="body1" className={classes.infoItem}>
                <strong>GPA:</strong> {student.gpa}
              </Typography>
            )}
            
            {student.campus ? (
              <Typography variant="body1" className={classes.infoItem}>
                <strong>Campus:</strong>{' '}
                <Link 
                  to={`/campus/${student.campus.id}`}
                  style={{ textDecoration: 'none', color: 'primary' }}
                >
                  {student.campus.name}
                </Link>
              </Typography>
            ) : (
              <Typography variant="body1" className={classes.infoItem} color="text.secondary">
                <strong>Campus:</strong> Not enrolled at any campus
              </Typography>
            )}
          </Box>

          <Box className={classes.actionButton}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              component={Link}
              to={`/student/${student.id}/edit`}
              fullWidth
            >
              Edit Student
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentView;