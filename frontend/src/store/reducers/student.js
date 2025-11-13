/*==================================================
/src/store/reducers/student.js

This is a Reducer function that accepts 2 parameters: the previous state object (aka current state) and an action object. 
Depending on the Action object, the Reducer updates the State and return the new State object.
It also defines the State and its default initial value.
================================================== */
import { FETCH_STUDENT } from "../actions/actionTypes";  // Import Action Type

// Define default Initial state
const initialState = {
  campus: {},  // Empty object
};

// REDUCER:
const student = (state=initialState, action) => {  // Use "initialState" as default Initial State
  switch (action.type) {
    case FETCH_STUDENT:
      return action.payload;
    default:
      // If the Reducer doesn't recognize the Action Type, returns the previous (current) State unchanged.
      return state;
  }
};

export default student;