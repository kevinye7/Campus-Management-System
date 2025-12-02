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

const useStyles = makeStyles(theme => ({
  root: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  studentCard: {
    maxWidth: '600px',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  studentImage: {
    height: '400px',
    objectFit: 'cover',
    width: '100%',
  },
  studentTitle: {
    color: '#1d1d1f',
    fontWeight: 600,
  },
  infoSection: {
    marginTop: '20px',
  },
  infoItem: {
    marginBottom: '15px',
    color: '#666666',
  },
  infoLabel: {
    color: '#1d1d1f',
    fontWeight: 500,
  },
  actionButton: {
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
  link: {
    color: '#1d1d1f',
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
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
        <CardContent style={{ padding: '24px' }}>
          <Typography variant="h3" component="h1" className={classes.studentTitle} gutterBottom>
            {name}
          </Typography>
          
          <Box className={classes.infoSection}>
            <Typography variant="body1" className={classes.infoItem}>
              <span className={classes.infoLabel}>Email:</span> {student.email}
            </Typography>
            
            {student.gpa !== null && student.gpa !== undefined && (
              <Typography variant="body1" className={classes.infoItem}>
                <span className={classes.infoLabel}>GPA:</span> {student.gpa}
              </Typography>
            )}
            
            {student.campus ? (
              <Typography variant="body1" className={classes.infoItem}>
                <span className={classes.infoLabel}>Campus:</span>{' '}
                <Link 
                  to={`/campus/${student.campus.id}`}
                  className={classes.link}
                >
                  {student.campus.name}
                </Link>
              </Typography>
            ) : (
              <Typography variant="body1" className={classes.infoItem}>
                <span className={classes.infoLabel}>Campus:</span> Not enrolled at any campus
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