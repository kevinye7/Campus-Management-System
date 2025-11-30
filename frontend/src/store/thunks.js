/*==================================================
/src/store/thunks.js

It contains all Thunk Creators and Thunks.
================================================== */
import * as ac from './actions/actionCreators';  // Import Action Creators ("ac" keyword Action Creator)
const axios = require('axios');

// Set up axios interceptor to include JWT token in requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up axios interceptor to handle 401 errors (unauthorized)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

//All Campuses
// THUNK CREATOR:
export const fetchAllCampusesThunk = () => async (dispatch) => {  // The THUNK
  try {
    // API "get" call to get "campuses" data from database
    let res = await axios.get(`/api/campuses`);  
    // Call Action Creator to return Action object (type + payload with "campuses" data)
    // Then dispatch the Action object to Reducer to update state 
    dispatch(ac.fetchAllCampuses(res.data));
  } catch(err) {
    console.error(err);
  }
};

// Edit Campus
// THUNK CREATOR:
export const editCampusThunk = (campus) => async (dispatch) => {  // The THUNK
  try {
    // API "put" call to update campus (based on "id" and "campus" object's data) from database
    let res = await axios.put(`/api/campuses/${campus.id}`, campus); 
    // Update successful so change state with dispatch
    dispatch(ac.editCampus(res.data));
    return res.data;
  } catch(err) {
    console.error(err);
  }
};

// Add Campus
// THUNK CREATOR:
export const addCampusThunk = (campus) => async (dispatch) => {  // The THUNK
  try {
    // API "post" call to add "campus" object's data to database
    let res = await axios.post(`/api/campuses`, campus);  
    // Call Action Creator to return Action object (type + payload with new campus data)
    // Then dispatch the Action object to Reducer to update state 
    dispatch(ac.addCampus(res.data));
    return res.data;
  } catch(err) {
    console.error(err);
  }
};

// Delete Campus
// THUNK CREATOR:
export const deleteCampusThunk = campusId => async dispatch => {  // The THUNK
  try {
    // API "delete" call to delete campus (based on "campusID") from database
    await axios.delete(`/api/campuses/${campusId}`);  
    // Delete successful so change state with dispatch
    dispatch(ac.deleteCampus(campusId));
  } catch(err) {
    console.error(err);
  }
};

// Single Campus
// THUNK CREATOR:
export const fetchCampusThunk = (id) => async (dispatch) => {  // The THUNK
  try {
    // API "get" call to get a student data (based on "id")from database
    let res = await axios.get(`/api/campuses/${id}`);  
    dispatch(ac.fetchCampus(res.data));
  } catch(err) {
    console.error(err);
  }
};

// All Students
// THUNK CREATOR:
export const fetchAllStudentsThunk = () => async (dispatch) => {  // The THUNK
  try {
    // API "get" call to get "students" data from database
    let res = await axios.get(`/api/students`);  
    // Call Action Creator to return Action object (type + payload with "students" data)
    // Then dispatch the Action object to Reducer to update state 
    dispatch(ac.fetchAllStudents(res.data));  
  } catch(err) {
    console.error(err);
  }
};

// Add Student
// THUNK CREATOR:
export const addStudentThunk = (student) => async (dispatch) => {  // The THUNK
  try {
    // API "post" call to add "student" object's data to database
    let res = await axios.post(`/api/students`, student);  
    // Call Action Creator to return Action object (type + payload with new students data)
    // Then dispatch the Action object to Reducer to update state 
    dispatch(ac.addStudent(res.data));
    return res.data;
  } catch(err) {
    console.error(err);
  }
};

// Delete Student
// THUNK CREATOR:
export const deleteStudentThunk = studentId => async dispatch => {  // The THUNK
  try {
    // API "delete" call to delete student (based on "studentID") from database
    await axios.delete(`/api/students/${studentId}`);  
    // Delete successful so change state with dispatch
    dispatch(ac.deleteStudent(studentId));
  } catch(err) {
    console.error(err);
  }
};

// Edit Student
// THUNK CREATOR:
export const editStudentThunk = student => async dispatch => {  // The THUNK
  try {
    // API "put" call to update student (based on "id" and "student" object's data) from database
    let res = await axios.put(`/api/students/${student.id}`, student); 
    // Update successful so change state with dispatch
    dispatch(ac.editStudent(res.data));
    return res.data;
  } catch(err) {
    console.error(err);
  }
};

// Single Student
// THUNK CREATOR:
export const fetchStudentThunk = id => async dispatch => {  // The THUNK
  try {
    // API "get" call to get a specific student (based on "id") data from database
    let res = await axios.get(`/api/students/${id}`);  
    // Call Action Creator to return Action object (type + payload with student data)
    // Then dispatch the Action object to Reducer to display student data 
    dispatch(ac.fetchStudent(res.data));
  } catch(err) {
    console.error(err);
  }
};

// Authentication
// THUNK CREATOR:
export const loginThunk = (username, password) => async dispatch => {
  try {
    const res = await axios.post('/api/auth/login', { username, password });
    const { token, user } = res.data;
    
    // Store token and user in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Dispatch login action
    dispatch(ac.login(user, token));
    return { success: true };
  } catch(err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Login failed' };
  }
};

// THUNK CREATOR:
export const registerThunk = (userData) => async dispatch => {
  try {
    const res = await axios.post('/api/auth/register', userData);
    return { success: true, user: res.data.user };
  } catch(err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Registration failed' };
  }
};

// THUNK CREATOR:
export const logoutThunk = () => async dispatch => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch(ac.logout());
};

// THUNK CREATOR:
export const fetchCurrentUserThunk = () => async dispatch => {
  try {
    const res = await axios.get('/api/auth/me');
    dispatch(ac.setUser(res.data.user));
    return res.data.user;
  } catch(err) {
    console.error(err);
    // If token is invalid, logout
    dispatch(ac.logout());
    return null;
  }
};
