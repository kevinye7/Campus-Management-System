/*==================================================
Header.js

It contains the Header component to be displayed on every page.
The header contains navigation links to every other page.
================================================== */
// Import "material" library for building UI with React components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { logoutThunk } from '../../store/thunks';

// Define styling for the header
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    fontType: 'bold',
    fontFamily: 'sans-serif', 
    fontSize: '35px', 
    color: 'darkblue'
  },
  appBar:{
    backgroundColor: '#fcb6bb',
    shadows: ['none'],
  },
  greeting:{
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: "50%",
    margin: "auto",
  },
  links:{
    textDecoration: 'none',
  }
}));

// Header component, displayed on every page
// Links to every other page
const Header = ({ user, isAuthenticated, logout }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={0} className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title} color="inherit" >
            Campus Management System
          </Typography>

          {isAuthenticated && (
            <>
              <Link className={classes.links} to={'/'} >
                <Button variant="contained" color="primary" style={{marginRight: '10px'}}>
                  Home
                </Button>
              </Link>

              <Link className={classes.links} to={'/campuses'} >
                <Button variant="contained" color="primary" style={{marginRight: '10px'}}>
                  All Campuses
                </Button>
              </Link>

              <Link className={classes.links} to={'/students'} >
                <Button variant="contained" color="primary" style={{marginRight: '10px'}}>
                  All Students
                </Button>
              </Link>

              {user && user.isAdmin && (
                <Link className={classes.links} to={'/admin'} >
                  <Button variant="contained" color="secondary" style={{marginRight: '10px'}}>
                    Admin
                  </Button>
                </Link>
              )}

              <Box style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {user && (
                  <Typography variant="body2" style={{ marginRight: '10px' }}>
                    {user.firstName} {user.lastName}
                    {user.isAdmin && ' (Admin)'}
                  </Typography>
                )}
                <Button variant="outlined" color="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );    
}

const mapState = (state) => {
  return {
    user: state.auth?.user || null,
    isAuthenticated: state.auth?.isAuthenticated || false,
  };
};

const mapDispatch = (dispatch) => {
  return {
    logout: () => dispatch(logoutThunk()),
  };
};

export default connect(mapState, mapDispatch)(Header);
