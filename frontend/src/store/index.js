/*==================================================
/src/store/index.js

It contains the necessities and accessories for constructing the Redux Store.
It creates a single Redux Store that holds the complete state tree of the app, so that the Redux Store state can access the states in all Reducers. 
================================================== */
import { combineReducers, applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

// Import all Reducers from the barrel file (/src/store/reducers/index.js)
import * as reducers from './reducers';

// Construct the Redux Store:
// Create a single Root Reducer to combine all Reducers, so that the Redux Store state can 
// access the states in all Reducers of the app.
const rootReducer = combineReducers(reducers);  
// Create a logger middleware to log dispatched Actions in console,
// so that it displays prevState, nextState, and Action when an Action is dispatched.
const logger = createLogger({ collapsed: true });  // Collapse console messages when displayed
// Create a Redux Store using Root Reducer and a middleware pipeline consisting of Thunk and logger.
const store = createStore(rootReducer, applyMiddleware(thunk, logger));

// Export the Redux Store by default, which will be provided to and injected within our entire application
export default store;