/*==================================================
AdminManagementContainer.js

Container for admin management screen.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import AdminManagementView from '../views/AdminManagementView';
import {
  fetchAllUsersThunk,
  fetchAllUserGroupsThunk,
  fetchAllCampusesAdminThunk,
  createUserGroupThunk,
  updateUserGroupThunk,
  deleteUserGroupThunk,
  updateUserThunk,
  deleteUserThunk,
  registerUserThunk
} from '../../store/thunks/admin';

class AdminManagementContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      error: null,
      success: null,
      users: [],
      userGroups: [],
      campuses: []
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    const [usersResult, userGroupsResult, campusesResult] = await Promise.all([
      this.props.fetchAllUsers(),
      this.props.fetchAllUserGroups(),
      this.props.fetchAllCampuses()
    ]);
    
    if (usersResult.success) {
      this.setState({ users: usersResult.users });
    }
    if (userGroupsResult.success) {
      this.setState({ userGroups: userGroupsResult.userGroups });
    }
    if (campusesResult.success) {
      this.setState({ campuses: campusesResult.campuses });
    }
  };

  handleTabChange = (event, newValue) => {
    this.setState({ selectedTab: newValue, error: null, success: null });
  };

  handleCreateUser = async (userData) => {
    this.setState({ error: null, success: null });
    const result = await this.props.registerUser(userData);
    if (result.success) {
      this.setState({ success: 'User created successfully' });
      const usersResult = await this.props.fetchAllUsers();
      if (usersResult.success) {
        this.setState({ users: usersResult.users });
      }
    } else {
      this.setState({ error: result.error });
    }
  };

  handleEditUser = async (userId, userData) => {
    this.setState({ error: null, success: null });
    // Remove password if empty
    if (!userData.password) {
      delete userData.password;
    }
    const result = await this.props.updateUser(userId, userData);
    if (result.success) {
      this.setState({ success: 'User updated successfully' });
      const usersResult = await this.props.fetchAllUsers();
      if (usersResult.success) {
        this.setState({ users: usersResult.users });
      }
    } else {
      this.setState({ error: result.error });
    }
  };

  handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    this.setState({ error: null, success: null });
    const result = await this.props.deleteUser(userId);
    if (result.success) {
      this.setState({ success: 'User deleted successfully' });
      const usersResult = await this.props.fetchAllUsers();
      if (usersResult.success) {
        this.setState({ users: usersResult.users });
      }
    } else {
      this.setState({ error: result.error });
    }
  };

  handleCreateUserGroup = async (userGroupData) => {
    this.setState({ error: null, success: null });
    const result = await this.props.createUserGroup(userGroupData);
    if (result.success) {
      this.setState({ success: 'User group created successfully' });
      const userGroupsResult = await this.props.fetchAllUserGroups();
      if (userGroupsResult.success) {
        this.setState({ userGroups: userGroupsResult.userGroups });
      }
    } else {
      this.setState({ error: result.error });
    }
  };

  handleEditUserGroup = async (userGroupId, userGroupData) => {
    this.setState({ error: null, success: null });
    const result = await this.props.updateUserGroup(userGroupId, userGroupData);
    if (result.success) {
      this.setState({ success: 'User group updated successfully' });
      const userGroupsResult = await this.props.fetchAllUserGroups();
      if (userGroupsResult.success) {
        this.setState({ userGroups: userGroupsResult.userGroups });
      }
    } else {
      this.setState({ error: result.error });
    }
  };

  handleDeleteUserGroup = async (userGroupId) => {
    if (!window.confirm('Are you sure you want to delete this user group?')) {
      return;
    }
    this.setState({ error: null, success: null });
    const result = await this.props.deleteUserGroup(userGroupId);
    if (result.success) {
      this.setState({ success: 'User group deleted successfully' });
      const userGroupsResult = await this.props.fetchAllUserGroups();
      if (userGroupsResult.success) {
        this.setState({ userGroups: userGroupsResult.userGroups });
      }
    } else {
      this.setState({ error: result.error });
    }
  };

  render() {
    return (
      <div>
        <Header />
        <AdminManagementView
          users={this.state.users}
          userGroups={this.state.userGroups}
          campuses={this.state.campuses}
          selectedTab={this.state.selectedTab}
          handleTabChange={this.handleTabChange}
          handleCreateUser={this.handleCreateUser}
          handleEditUser={this.handleEditUser}
          handleDeleteUser={this.handleDeleteUser}
          handleCreateUserGroup={this.handleCreateUserGroup}
          handleEditUserGroup={this.handleEditUserGroup}
          handleDeleteUserGroup={this.handleDeleteUserGroup}
          error={this.state.error}
          success={this.state.success}
        />
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    user: state.auth?.user || null,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchAllUsers: () => dispatch(fetchAllUsersThunk()),
    fetchAllUserGroups: () => dispatch(fetchAllUserGroupsThunk()),
    fetchAllCampuses: () => dispatch(fetchAllCampusesAdminThunk()),
    createUserGroup: (data) => dispatch(createUserGroupThunk(data)),
    updateUserGroup: (id, data) => dispatch(updateUserGroupThunk(id, data)),
    deleteUserGroup: (id) => dispatch(deleteUserGroupThunk(id)),
    updateUser: (id, data) => dispatch(updateUserThunk(id, data)),
    deleteUser: (id) => dispatch(deleteUserThunk(id)),
    registerUser: (data) => dispatch(registerUserThunk(data)),
  };
};

export default connect(mapState, mapDispatch)(AdminManagementContainer);

