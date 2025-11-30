/*==================================================
/src/store/reducers/auth.js

This is a Reducer function for authentication state.
================================================== */
import * as at from "../actions/actionTypes";

// Initialize state from localStorage if available
const getInitialState = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  return {
    user,
    token,
    isAuthenticated: !!(token && user),
    error: null
  };
};

// REDUCER:
const auth = (state = getInitialState(), action) => {
  switch (action.type) {
    case at.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null
      };
    case at.LOGOUT:
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        error: null
      };
    case at.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload
      };
    case at.CLEAR_AUTH_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export default auth;

