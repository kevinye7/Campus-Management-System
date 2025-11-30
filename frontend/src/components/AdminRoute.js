/*==================================================
AdminRoute.js

A component to protect admin routes that require admin access.
================================================== */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const AdminRoute = ({ component: Component, isAuthenticated, isAssociationAdmin, isGroupAdmin, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }
        if (!isAssociationAdmin && !isGroupAdmin) {
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
    isAssociationAdmin: state.auth?.user?.isAssociationAdmin || false,
    isGroupAdmin: state.auth?.user?.isGroupAdmin || false,
  };
};

export default connect(mapState)(AdminRoute);

