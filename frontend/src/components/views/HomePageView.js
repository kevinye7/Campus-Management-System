/*==================================================
HomePageView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display the home page.
================================================== */
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  welcomeCard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)',
    padding: '30px',
    marginBottom: '30px',
    [theme.breakpoints.down('xs')]: {
      padding: '20px',
    },
  },
  title: {
    color: '#1d1d1f',
    fontWeight: 600,
    marginBottom: '10px',
    fontSize: 'clamp(28px, 5vw, 40px)',
  },
  subtitle: {
    color: '#666666',
    fontSize: '16px',
    marginTop: '5px',
  },
  statsGrid: {
    marginBottom: '30px',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)',
    padding: '24px',
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
    },
  },
  statNumber: {
    color: '#1d1d1f',
    fontWeight: 700,
    fontSize: 'clamp(32px, 5vw, 48px)',
    marginBottom: '8px',
  },
  statLabel: {
    color: '#666666',
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statIcon: {
    color: '#1d1d1f',
    fontSize: '40px',
    marginBottom: '12px',
    opacity: 0.7,
  },
  sectionTitle: {
    color: '#1d1d1f',
    fontWeight: 600,
    fontSize: '24px',
    marginBottom: '20px',
    marginTop: '10px',
  },
  quickActionsCard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)',
    padding: '24px',
    marginBottom: '30px',
  },
  actionButton: {
    background: '#1d1d1f !important',
    color: 'white !important',
    borderRadius: '10px !important',
    padding: '12px 24px !important',
    fontWeight: 500,
    textTransform: 'none',
    fontSize: '15px',
    width: '100%',
    marginBottom: '12px',
    '&:hover': {
      background: '#000000 !important',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
    },
  },
  recentCard: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)',
    padding: '24px',
  },
  recentItem: {
    padding: '16px',
    marginBottom: '12px',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'block',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.8)',
      transform: 'translateX(4px)',
    },
  },
  recentItemTitle: {
    color: '#1d1d1f',
    fontWeight: 600,
    fontSize: '16px',
    marginBottom: '4px',
  },
  recentItemSubtitle: {
    color: '#666666',
    fontSize: '14px',
  },
  emptyState: {
    color: '#666666',
    textAlign: 'center',
    padding: '40px 20px',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
}));

const HomePageView = ({ campuses = [], students = [], user }) => {
  const classes = useStyles();
  
  // Calculate statistics
  const totalCampuses = campuses.length;
  const totalStudents = students.length;
  const studentsWithCampus = students.filter(s => s.campusId || (s.campus && s.campus.id)).length;
  const unenrolledStudents = totalStudents - studentsWithCampus;
  
  // Get recent campuses (last 3)
  const recentCampuses = campuses.slice(0, 3);
  
  // Get recent students (last 3)
  const recentStudents = students.slice(0, 3);
  
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const associationName = user?.association?.name || '';

  return (
    <div className={classes.root}>
      {/* Welcome Section */}
      <Box className={classes.welcomeCard}>
        <Typography variant="h2" className={classes.title}>
          Welcome back, {userName}!
        </Typography>
        {associationName && (
          <Typography variant="body1" className={classes.subtitle}>
            {associationName}
          </Typography>
        )}
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} className={classes.statsGrid}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <CardContent style={{ padding: '24px', textAlign: 'center' }}>
              <SchoolIcon className={classes.statIcon} />
              <Typography className={classes.statNumber}>
                {totalCampuses}
              </Typography>
              <Typography className={classes.statLabel}>
                Campuses
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <CardContent style={{ padding: '24px', textAlign: 'center' }}>
              <PeopleIcon className={classes.statIcon} />
              <Typography className={classes.statNumber}>
                {totalStudents}
              </Typography>
              <Typography className={classes.statLabel}>
                Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <CardContent style={{ padding: '24px', textAlign: 'center' }}>
              <TrendingUpIcon className={classes.statIcon} />
              <Typography className={classes.statNumber}>
                {studentsWithCampus}
              </Typography>
              <Typography className={classes.statLabel}>
                Enrolled
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={classes.statCard}>
            <CardContent style={{ padding: '24px', textAlign: 'center' }}>
              <LocationOnIcon className={classes.statIcon} />
              <Typography className={classes.statNumber}>
                {unenrolledStudents}
              </Typography>
              <Typography className={classes.statLabel}>
                Unenrolled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Box className={classes.quickActionsCard}>
            <Typography className={classes.sectionTitle}>
              Quick Actions
            </Typography>
            <Link to="/newcampus" className={classes.link}>
              <Button
                className={classes.actionButton}
                startIcon={<AddIcon />}
                fullWidth
              >
                Add New Campus
              </Button>
            </Link>
            <Link to="/newstudent" className={classes.link}>
              <Button
                className={classes.actionButton}
                startIcon={<AddIcon />}
                fullWidth
              >
                Add New Student
              </Button>
            </Link>
            <Link to="/campuses" className={classes.link}>
              <Button
                className={classes.actionButton}
                startIcon={<SchoolIcon />}
                fullWidth
              >
                View All Campuses
              </Button>
            </Link>
            <Link to="/students" className={classes.link}>
              <Button
                className={classes.actionButton}
                startIcon={<PeopleIcon />}
                fullWidth
              >
                View All Students
              </Button>
            </Link>
          </Box>
        </Grid>

        {/* Recent Campuses */}
        <Grid item xs={12} md={4}>
          <Box className={classes.recentCard}>
            <Typography className={classes.sectionTitle}>
              Recent Campuses
            </Typography>
            {recentCampuses.length > 0 ? (
              recentCampuses.map(campus => (
                <Link
                  key={campus.id}
                  to={`/campus/${campus.id}`}
                  className={classes.recentItem}
                >
                  <Typography className={classes.recentItemTitle}>
                    {campus.name}
                  </Typography>
                  {campus.address && (
                    <Typography className={classes.recentItemSubtitle}>
                      {campus.address}
                    </Typography>
                  )}
                </Link>
              ))
            ) : (
              <Typography className={classes.emptyState}>
                No campuses yet. Create your first campus!
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Recent Students */}
        <Grid item xs={12} md={4}>
          <Box className={classes.recentCard}>
            <Typography className={classes.sectionTitle}>
              Recent Students
            </Typography>
            {recentStudents.length > 0 ? (
              recentStudents.map(student => {
                const name = `${student.firstname} ${student.lastname}`;
                return (
                  <Link
                    key={student.id}
                    to={`/student/${student.id}`}
                    className={classes.recentItem}
                  >
                    <Typography className={classes.recentItemTitle}>
                      {name}
                    </Typography>
                    {student.email && (
                      <Typography className={classes.recentItemSubtitle}>
                        {student.email}
                      </Typography>
                    )}
                  </Link>
                );
              })
            ) : (
              <Typography className={classes.emptyState}>
                No students yet. Add your first student!
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </div>
  );    
}

export default HomePageView;