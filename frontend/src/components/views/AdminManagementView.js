/*==================================================
AdminManagementView.js

Admin management screen for users, user groups, and associations.
================================================== */
import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LockResetIcon from '@mui/icons-material/LockReset';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  title: {
    color: '#1d1d1f',
    fontWeight: 600,
    marginBottom: '30px',
    fontSize: 'clamp(24px, 5vw, 36px)',
  },
  paper: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  tabPanel: {
    padding: '20px 0',
  },
  tableContainer: {
    marginTop: '20px',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '12px',
  },
  actionButtons: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  actionButton: {
    background: '#1d1d1f !important',
    color: 'white !important',
    borderRadius: '10px !important',
    padding: '10px 20px !important',
    fontWeight: 500,
    textTransform: 'none',
    '&:hover': {
      background: '#000000 !important',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.2)',
    },
  },
  outlinedButton: {
    background: 'rgba(0, 0, 0, 0.04) !important',
    border: '1px solid rgba(0, 0, 0, 0.1) !important',
    color: '#1d1d1f !important',
    borderRadius: '10px !important',
    padding: '10px 20px !important',
    fontWeight: 500,
    textTransform: 'none',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.08) !important',
      transform: 'translateY(-1px)',
    },
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    minWidth: '400px',
  },
  chip: {
    margin: '2px',
  },
  alert: {
    borderRadius: '12px',
    marginBottom: '20px',
  },
}));

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminManagementView = (props) => {
  const {
    users,
    userGroups,
    campuses,
    associations,
    selectedTab,
    handleTabChange,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    handleCreateUserGroup,
    handleEditUserGroup,
    handleDeleteUserGroup,
    handleAssignUserToGroup,
    handleAssignUserToAssociation,
    handleResetPassword,
    error,
    success
  } = props;

  const classes = useStyles();
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userGroupDialogOpen, setUserGroupDialogOpen] = useState(false);
  const [assignUserDialogOpen, setAssignUserDialogOpen] = useState(false);
  const [assignAssociationDialogOpen, setAssignAssociationDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingUserGroup, setEditingUserGroup] = useState(null);
  const [assignFormData, setAssignFormData] = useState({
    usernameOrEmail: '',
    groupId: '',
    associationId: ''
  });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userGroupId: '',
    isAssociationAdmin: false,
    isGroupAdmin: false,
    useDefaultPassword: true
  });
  const [userGroupFormData, setUserGroupFormData] = useState({
    name: '',
    description: '',
    campusIds: []
  });

  const handleOpenUserDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        userGroupId: user.userGroupId || '',
        isAssociationAdmin: user.isAssociationAdmin || false,
        isGroupAdmin: user.isGroupAdmin || false,
        useDefaultPassword: false
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        userGroupId: '',
        isAssociationAdmin: false,
        isGroupAdmin: false,
        useDefaultPassword: true
      });
    }
    setUserDialogOpen(true);
  };

  const handleCloseUserDialog = () => {
    setUserDialogOpen(false);
    setEditingUser(null);
  };

  const handleOpenUserGroupDialog = (userGroup = null) => {
    if (userGroup) {
      setEditingUserGroup(userGroup);
      setUserGroupFormData({
        name: userGroup.name || '',
        description: userGroup.description || '',
        campusIds: userGroup.campuses ? userGroup.campuses.map(c => c.id) : []
      });
    } else {
      setEditingUserGroup(null);
      setUserGroupFormData({
        name: '',
        description: '',
        campusIds: []
      });
    }
    setUserGroupDialogOpen(true);
  };

  const handleCloseUserGroupDialog = () => {
    setUserGroupDialogOpen(false);
    setEditingUserGroup(null);
  };

  const handleUserSubmit = () => {
    if (editingUser) {
      handleEditUser(editingUser.id, formData);
    } else {
      handleCreateUser(formData);
    }
    handleCloseUserDialog();
  };

  const handleUserGroupSubmit = () => {
    if (editingUserGroup) {
      handleEditUserGroup(editingUserGroup.id, userGroupFormData);
    } else {
      handleCreateUserGroup(userGroupFormData);
    }
    handleCloseUserGroupDialog();
  };

  return (
    <div className={classes.root}>
      <Typography variant="h3" component="h1" className={classes.title}>
        Admin Management
      </Typography>

      {error && (
        <Alert severity="error" className={classes.alert}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className={classes.alert}>
          {success}
        </Alert>
      )}

      <Paper className={classes.paper}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Users" />
          <Tab label="User Groups" />
        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          <Box className={classes.actionButtons}>
            <Button
              className={classes.actionButton}
              startIcon={<AddIcon />}
              onClick={() => handleOpenUserDialog()}
            >
              Add User
            </Button>
            <Button
              className={classes.outlinedButton}
              startIcon={<PersonAddIcon />}
              onClick={() => setAssignUserDialogOpen(true)}
            >
              Assign User to Group
            </Button>
            {associations && associations.length > 0 && (
              <Button
                className={classes.outlinedButton}
                startIcon={<GroupAddIcon />}
                onClick={() => setAssignAssociationDialogOpen(true)}
              >
                Assign User to Association
              </Button>
            )}
          </Box>

          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>User Group</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Password</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users && users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.userGroup ? user.userGroup.name : 'None'}</TableCell>
                    <TableCell>
                      {user.isAssociationAdmin && 'Association Admin'}
                      {!user.isAssociationAdmin && user.isGroupAdmin && 'Group Admin'}
                      {!user.isAssociationAdmin && !user.isGroupAdmin && 'User'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenUserDialog(user)}
                        style={{ color: '#666666' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        style={{ color: '#666666' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleResetPassword(user.id)}
                        title="Reset Password"
                        style={{ color: '#666666' }}
                      >
                        <LockResetIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Box className={classes.actionButtons}>
            <Button
              className={classes.actionButton}
              startIcon={<AddIcon />}
              onClick={() => handleOpenUserGroupDialog()}
            >
              Add User Group
            </Button>
          </Box>

          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Campuses</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userGroups && userGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.description || 'N/A'}</TableCell>
                    <TableCell>
                      {group.campuses && group.campuses.length > 0 ? (
                        group.campuses.map((campus) => (
                          <Chip
                            key={campus.id}
                            label={campus.name}
                            size="small"
                            className={classes.chip}
                          />
                        ))
                      ) : (
                        'None'
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenUserGroupDialog(group)}
                        style={{ color: '#666666' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUserGroup(group.id)}
                        style={{ color: '#666666' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* User Dialog */}
      <Dialog open={userDialogOpen} onClose={handleCloseUserDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit User' : 'Create User'}</DialogTitle>
        <DialogContent>
          <Box className={classes.dialogContent}>
            <TextField
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {!editingUser && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.useDefaultPassword}
                    onChange={(e) => setFormData({ ...formData, useDefaultPassword: e.target.checked, password: '' })}
                  />
                }
                label="Use default password (will be emailed to user)"
              />
            )}
            {!formData.useDefaultPassword && (
              <TextField
                label={editingUser ? "New Password (leave blank to keep current)" : "Password"}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
              />
            )}
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
            <FormControl>
              <InputLabel>User Group</InputLabel>
              <Select
                value={formData.userGroupId}
                onChange={(e) => setFormData({ ...formData, userGroupId: e.target.value })}
                label="User Group"
              >
                <MenuItem value="">None</MenuItem>
                {userGroups && userGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAssociationAdmin}
                  onChange={(e) => setFormData({ ...formData, isAssociationAdmin: e.target.checked })}
                />
              }
              label="Association Admin"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isGroupAdmin}
                  onChange={(e) => setFormData({ ...formData, isGroupAdmin: e.target.checked })}
                />
              }
              label="Group Admin"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDialog} style={{ color: '#666666' }}>Cancel</Button>
          <Button 
            onClick={handleUserSubmit} 
            style={{
              background: '#1d1d1f',
              color: 'white',
              borderRadius: '10px',
              padding: '8px 20px',
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Group Dialog */}
      <Dialog open={userGroupDialogOpen} onClose={handleCloseUserGroupDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUserGroup ? 'Edit User Group' : 'Create User Group'}</DialogTitle>
        <DialogContent>
          <Box className={classes.dialogContent}>
            <TextField
              label="Name"
              value={userGroupFormData.name}
              onChange={(e) => setUserGroupFormData({ ...userGroupFormData, name: e.target.value })}
              required
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              value={userGroupFormData.description}
              onChange={(e) => setUserGroupFormData({ ...userGroupFormData, description: e.target.value })}
            />
            <FormControl>
              <InputLabel>Campuses</InputLabel>
              <Select
                multiple
                value={userGroupFormData.campusIds}
                onChange={(e) => setUserGroupFormData({ ...userGroupFormData, campusIds: e.target.value })}
                label="Campuses"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const campus = campuses?.find(c => c.id === value);
                      return <Chip key={value} label={campus?.name || value} size="small" />;
                    })}
                  </Box>
                )}
              >
                {campuses && campuses.map((campus) => (
                  <MenuItem key={campus.id} value={campus.id}>
                    <Checkbox checked={userGroupFormData.campusIds.indexOf(campus.id) > -1} />
                    {campus.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserGroupDialog} style={{ color: '#666666' }}>Cancel</Button>
          <Button 
            onClick={handleUserGroupSubmit} 
            style={{
              background: '#1d1d1f',
              color: 'white',
              borderRadius: '10px',
              padding: '8px 20px',
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            {editingUserGroup ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign User to Group Dialog */}
      <Dialog open={assignUserDialogOpen} onClose={() => setAssignUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign User to Group</DialogTitle>
        <DialogContent>
          <Box className={classes.dialogContent}>
            <TextField
              fullWidth
              label="Username or Email"
              value={assignFormData.usernameOrEmail}
              onChange={(e) => setAssignFormData({ ...assignFormData, usernameOrEmail: e.target.value })}
              required
            />
            <FormControl>
              <InputLabel>User Group</InputLabel>
              <Select
                value={assignFormData.groupId}
                onChange={(e) => setAssignFormData({ ...assignFormData, groupId: e.target.value })}
                label="User Group"
              >
                <MenuItem value="">Select Group</MenuItem>
                {userGroups && userGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setAssignUserDialogOpen(false);
              setAssignFormData({ usernameOrEmail: '', groupId: '', associationId: '' });
            }}
            style={{ color: '#666666' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (handleAssignUserToGroup) {
                handleAssignUserToGroup(assignFormData.usernameOrEmail, assignFormData.groupId);
              }
              setAssignUserDialogOpen(false);
              setAssignFormData({ usernameOrEmail: '', groupId: '', associationId: '' });
            }} 
            disabled={!assignFormData.usernameOrEmail || !assignFormData.groupId}
            style={{
              background: assignFormData.usernameOrEmail && assignFormData.groupId ? '#1d1d1f' : 'rgba(0, 0, 0, 0.2)',
              color: 'white',
              borderRadius: '10px',
              padding: '8px 20px',
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign User to Association Dialog */}
      <Dialog open={assignAssociationDialogOpen} onClose={() => setAssignAssociationDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign User to Association</DialogTitle>
        <DialogContent>
          <Box className={classes.dialogContent}>
            <TextField
              fullWidth
              label="Username or Email"
              value={assignFormData.usernameOrEmail}
              onChange={(e) => setAssignFormData({ ...assignFormData, usernameOrEmail: e.target.value })}
              required
            />
            <FormControl>
              <InputLabel>Association</InputLabel>
              <Select
                value={assignFormData.associationId}
                onChange={(e) => setAssignFormData({ ...assignFormData, associationId: e.target.value })}
                label="Association"
              >
                <MenuItem value="">Select Association</MenuItem>
                {associations && associations.map((association) => (
                  <MenuItem key={association.id} value={association.id}>
                    {association.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setAssignAssociationDialogOpen(false);
              setAssignFormData({ usernameOrEmail: '', groupId: '', associationId: '' });
            }}
            style={{ color: '#666666' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (handleAssignUserToAssociation) {
                handleAssignUserToAssociation(assignFormData.usernameOrEmail, assignFormData.associationId);
              }
              setAssignAssociationDialogOpen(false);
              setAssignFormData({ usernameOrEmail: '', groupId: '', associationId: '' });
            }} 
            disabled={!assignFormData.usernameOrEmail || !assignFormData.associationId}
            style={{
              background: assignFormData.usernameOrEmail && assignFormData.associationId ? '#1d1d1f' : 'rgba(0, 0, 0, 0.2)',
              color: 'white',
              borderRadius: '10px',
              padding: '8px 20px',
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminManagementView;

