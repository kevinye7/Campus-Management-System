import * as at from './actionTypes';

// ACTION CREATORS;
/** needs to be an action creator
 * for each action type
 */

// All Campuses
export const fetchAllCampuses = (campuses) => {
  return {
    type: at.FETCH_ALL_CAMPUSES,
    payload: campuses,
  };
};

export const deleteCampus = (campusId) => {
  return {
    type: at.DELETE_CAMPUS,
    payload: campusId,
  };
};

export const editCampus = (campus) => {
  return {
    type: at.EDIT_CAMPUS,
    payload: campus,
  };
};

export const addCampus = (campus) => {
  return {
    type: at.ADD_CAMPUS,
    payload: campus,
  };
};

//Single Campus
export const fetchCampus = (campus) => {
  return {
    type: at.FETCH_CAMPUS,
    payload: campus,
  };
};

//All Students
export const fetchAllStudents = (students) => {
  return {
    type: at.FETCH_ALL_STUDENTS,
    payload: students,
  };
};

export const addStudent = (student) => {
  return {
    type: at.ADD_STUDENT,
    payload: student,
  };
};

export const deleteStudent = (studentId) => {
  return {
    type: at.DELETE_STUDENT,
    payload: studentId,
  };
};


export const editStudent = (student) => {
  return {
    type: at.EDIT_STUDENT,
    payload: student,
  };
};

//Single Student
export const fetchStudent = (student) => {
  return {
    type: at.FETCH_STUDENT,
    payload: student,
  };
};

//Authentication
export const login = (user, token) => {
  return {
    type: at.LOGIN,
    payload: { user, token },
  };
};

export const logout = () => {
  return {
    type: at.LOGOUT,
  };
};

export const setUser = (user) => {
  return {
    type: at.SET_USER,
    payload: user,
  };
};

export const clearAuthError = () => {
  return {
    type: at.CLEAR_AUTH_ERROR,
  };
};