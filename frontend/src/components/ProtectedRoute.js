/*==================================================
ProtectedRoute.js

A component to protect routes that require authentication.
================================================== */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

const mapState = (state) => {
  return {
    isAuthenticated: state.auth?.isAuthenticated || false,
  };
};

export default connect(mapState)(ProtectedRoute);

