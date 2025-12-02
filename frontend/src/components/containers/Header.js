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
    fontSize: 'clamp(18px, 4vw, 28px)',
    color: '#1d1d1f',
    fontWeight: 600,
  },
  appBar:{
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 2px 16px 0 rgba(0, 0, 0, 0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  toolbar: {
    padding: '10px 16px',
    [theme.breakpoints.up('sm')]: {
      padding: '10px 24px',
    },
    flexWrap: 'wrap',
    gap: '8px',
  },
  navButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: '10px',
      justifyContent: 'center',
    },
  },
  button: {
    background: 'rgba(0, 0, 0, 0.04) !important',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 0, 0, 0.1) !important',
    color: '#1d1d1f !important',
    borderRadius: '10px !important',
    padding: '8px 16px !important',
    fontWeight: 500,
    textTransform: 'none',
    fontSize: '14px',
    transition: 'all 0.3s ease !important',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.08) !important',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)',
    },
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginTop: '10px',
      width: '100%',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
  },
  userText: {
    color: '#1d1d1f',
    fontSize: '14px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
    },
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
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title} color="inherit" >
            Campus Management System
          </Typography>

          {!isAuthenticated && (
            <div className={classes.navButtons}>
              <Link className={classes.links} to={'/register'} >
                <Button className={classes.button}>
                  Create Association
                </Button>
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <>
              <div className={classes.navButtons}>
                <Link className={classes.links} to={'/'} >
                  <Button className={classes.button}>
                    Home
                  </Button>
                </Link>

                <Link className={classes.links} to={'/campuses'} >
                  <Button className={classes.button}>
                    Campuses
                  </Button>
                </Link>

                <Link className={classes.links} to={'/students'} >
                  <Button className={classes.button}>
                    Students
                  </Button>
                </Link>

                {user && (user.isAssociationAdmin || user.isGroupAdmin) && (
                  <Link className={classes.links} to={'/admin'} >
                    <Button className={classes.button} style={{background: 'rgba(0, 0, 0, 0.12) !important', fontWeight: 600}}>
                      Admin
                    </Button>
                  </Link>
                )}
              </div>

              <Box className={classes.userInfo}>
                {user && (
                  <Typography variant="body2" className={classes.userText}>
                    {user.firstName} {user.lastName}
                    {user.isAssociationAdmin && ' (Assoc. Admin)'}
                    {!user.isAssociationAdmin && user.isGroupAdmin && ' (Group Admin)'}
                    {user.association && ` - ${user.association.name}`}
                  </Typography>
                )}
                <Button className={classes.button} onClick={handleLogout} style={{background: 'rgba(0, 0, 0, 0.12) !important', fontWeight: 600}}>
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
