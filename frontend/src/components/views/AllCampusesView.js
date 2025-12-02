/*==================================================
AllCampusesView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display all campuses.
================================================== */
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
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
  campusCard: {
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
  campusImage: {
    height: '200px',
    objectFit: 'cover',
    width: '100%',
  },
  cardContent: {
    flexGrow: 1,
    padding: '20px !important',
  },
  campusName: {
    color: '#1d1d1f',
    fontWeight: 600,
    textDecoration: 'none !important',
    marginBottom: '10px',
    display: 'block',
    '&:hover': {
      color: '#000000',
    },
  },
  campusText: {
    color: '#666666',
  },
  emptyText: {
    color: '#666666',
    textAlign: 'center',
    padding: '40px',
  },
}));

const AllCampusesView = (props) => {
  const {allCampuses, deleteCampus} = props;
  const classes = useStyles();
  
  // If there is no campus, display a message.
  if (!allCampuses.length) {
    return (
      <div className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h3" component="h1" className={classes.headerTitle}>
          All Campuses
        </Typography>
        <Button
          className={classes.addButton}
          startIcon={<AddIcon />}
          component={Link}
          to="/newcampus"
        >
          Add New Campus
        </Button>
      </Box>
        <Typography variant="body1" className={classes.emptyText}>
          There are no campuses.
        </Typography>
      </div>
    );
  }

  // If there is at least one campus, render All Campuses view 
  return (
    <div className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h3" component="h1" className={classes.headerTitle}>
          All Campuses
        </Typography>
        <Button
          className={classes.addButton}
          startIcon={<AddIcon />}
          component={Link}
          to="/newcampus"
        >
          Add New Campus
        </Button>
      </Box>

      <Grid container spacing={3}>
        {allCampuses.map((campus) => (
          <Grid item xs={12} sm={6} md={4} key={campus.id}>
            <Card className={classes.campusCard}>
              {campus.imageUrl && (
                <CardMedia
                  component="img"
                  className={classes.campusImage}
                  image={campus.imageUrl}
                  alt={campus.name}
                />
              )}
              <CardContent className={classes.cardContent}>
                <Typography 
                  variant="h5" 
                  component={Link} 
                  to={`/campus/${campus.id}`}
                  className={classes.campusName}
                >
                  {campus.name}
                </Typography>
                <Typography variant="body2" className={classes.campusText} paragraph>
                  {campus.address}
                </Typography>
                {campus.description && (
                  <Typography variant="body2" className={classes.campusText} paragraph>
                    {campus.description.length > 100 
                      ? campus.description.substring(0, 100) + '...' 
                      : campus.description}
                  </Typography>
                )}
              </CardContent>
              <CardActions style={{ padding: '0 20px 20px 20px' }}>
                <IconButton
                  onClick={() => deleteCampus(campus.id)}
                  aria-label="delete campus"
                  style={{ 
                    color: '#666666',
                    '&:hover': { color: '#1d1d1f' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

// Validate data type of the props passed to component.
AllCampusesView.propTypes = {
  allCampuses: PropTypes.array.isRequired,
};

export default AllCampusesView;