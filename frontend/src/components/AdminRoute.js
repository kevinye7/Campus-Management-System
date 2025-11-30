/*==================================================
AdminRoute.js

A component to protect admin routes that require admin access.
================================================== */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const AdminRoute = ({ component: Component, isAuthenticated, isAdmin, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }
        if (!isAdmin) {
          return <Redirect to="/" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

const mapState = (state) => {
  return {
    isAuthenticated: state.auth?.isAuthenticated || false,
    isAdmin: state.auth?.user?.isAdmin || false,
  };
};

export default connect(mapState)(AdminRoute);

