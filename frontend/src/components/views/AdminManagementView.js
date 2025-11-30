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

const useStyles = makeStyles(() => ({
  root: {
    padding: '20px',
  },
  tabPanel: {
    padding: '20px 0',
  },
  tableContainer: {
    marginTop: '20px',
  },
  actionButtons: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
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
    isGroupAdmin: false
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
        isGroupAdmin: user.isGroupAdmin || false
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
        isGroupAdmin: false
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
      <Typography variant="h3" component="h1" gutterBottom>
        Admin Management
      </Typography>

      {error && (
        <Alert severity="error" style={{ marginBottom: '20px' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" style={{ marginBottom: '20px' }}>
          {success}
        </Alert>
      )}

      <Paper>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="Users" />
          <Tab label="User Groups" />
        </Tabs>

        <TabPanel value={selectedTab} index={0}>
          <Box className={classes.actionButtons}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenUserDialog()}
            >
              Add User
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={() => setAssignUserDialogOpen(true)}
            >
              Assign User to Group
            </Button>
            {associations && associations.length > 0 && (
              <Button
                variant="outlined"
                color="secondary"
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
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
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

        <TabPanel value={selectedTab} index={1}>
          <Box className={classes.actionButtons}>
            <Button
              variant="contained"
              color="primary"
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
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteUserGroup(group.id)}
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
            <TextField
              label={editingUser ? "New Password (leave blank to keep current)" : "Password"}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingUser}
            />
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
          <Button onClick={handleCloseUserDialog}>Cancel</Button>
          <Button onClick={handleUserSubmit} variant="contained" color="primary">
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
          <Button onClick={handleCloseUserGroupDialog}>Cancel</Button>
          <Button onClick={handleUserGroupSubmit} variant="contained" color="primary">
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
          <Button onClick={() => {
            setAssignUserDialogOpen(false);
            setAssignFormData({ usernameOrEmail: '', groupId: '', associationId: '' });
          }}>Cancel</Button>
          <Button 
            onClick={() => {
              if (handleAssignUserToGroup) {
                handleAssignUserToGroup(assignFormData.usernameOrEmail, assignFormData.groupId);
              }
              setAssignUserDialogOpen(false);
              setAssignFormData({ usernameOrEmail: '', groupId: '', associationId: '' });
            }} 
            variant="contained" 
            color="primary"
            disabled={!assignFormData.usernameOrEmail || !assignFormData.groupId}
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
          <Button onClick={() => {
            setAssignAssociationDialogOpen(false);
            setAssignFormData({ usernameOrEmail: '', groupId: '', associationId: '' });
          }}>Cancel</Button>
          <Button 
            onClick={() => {
              if (handleAssignUserToAssociation) {
                handleAssignUserToAssociation(assignFormData.usernameOrEmail, assignFormData.associationId);
              }
              setAssignAssociationDialogOpen(false);
              setAssignFormData({ usernameOrEmail: '', groupId: '', associationId: '' });
            }} 
            variant="contained" 
            color="primary"
            disabled={!assignFormData.usernameOrEmail || !assignFormData.associationId}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminManagementView;

