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
  campusCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  campusImage: {
    height: '200px',
    objectFit: 'cover',
  },
  cardContent: {
    flexGrow: 1,
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
          <Typography variant="h3" component="h1">
            All Campuses
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/newcampus"
          >
            Add New Campus
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          There are no campuses.
        </Typography>
      </div>
    );
  }

  // If there is at least one campus, render All Campuses view 
  return (
    <div className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h3" component="h1">
          All Campuses
        </Typography>
        <Button
          variant="contained"
          color="primary"
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
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '10px' }}
                >
                  {campus.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {campus.address}
                </Typography>
                {campus.description && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {campus.description.length > 100 
                      ? campus.description.substring(0, 100) + '...' 
                      : campus.description}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <IconButton
                  color="error"
                  onClick={() => deleteCampus(campus.id)}
                  aria-label="delete campus"
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