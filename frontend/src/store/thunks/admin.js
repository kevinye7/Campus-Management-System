/*==================================================
/src/store/thunks/admin.js

Admin-related thunks for user and user group management.
================================================== */
import axios from 'axios';

// GET ALL USERS
export const fetchAllUsersThunk = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/admin/users');
    return { success: true, users: res.data };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Failed to fetch users' };
  }
};

// GET ALL USER GROUPS
export const fetchAllUserGroupsThunk = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/admin/user-groups');
    return { success: true, userGroups: res.data };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Failed to fetch user groups' };
  }
};

// GET ALL CAMPUSES (admin only)
export const fetchAllCampusesAdminThunk = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/admin/campuses');
    return { success: true, campuses: res.data };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Failed to fetch campuses' };
  }
};

// CREATE USER GROUP
export const createUserGroupThunk = (userGroupData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/admin/user-groups', userGroupData);
    return { success: true, userGroup: res.data };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Failed to create user group' };
  }
};

// UPDATE USER GROUP
export const updateUserGroupThunk = (id, userGroupData) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/admin/user-groups/${id}`, userGroupData);
    return { success: true, userGroup: res.data };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Failed to update user group' };
  }
};

// DELETE USER GROUP
export const deleteUserGroupThunk = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/admin/user-groups/${id}`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Failed to delete user group' };
  }
};

// UPDATE USER
export const updateUserThunk = (id, userData) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/admin/users/${id}`, userData);
    return { success: true, user: res.data };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Failed to update user' };
  }
};

// DELETE USER
export const deleteUserThunk = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/admin/users/${id}`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Failed to delete user' };
  }
};

// REGISTER NEW USER
export const registerUserThunk = (userData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/auth/register', userData);
    return { success: true, user: res.data.user };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Failed to register user' };
  }
};

// GET ALL ASSOCIATIONS
export const fetchAllAssociationsThunk = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/associations');
    return { success: true, associations: res.data };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.response?.data?.error || 'Failed to fetch associations' };
  }
};

