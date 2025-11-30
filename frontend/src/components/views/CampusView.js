/*==================================================
CampusView.js

The Views component is responsible for rendering web page with data provided by the corresponding Container component.
It constructs a React component to display a single campus and its students (if any).
================================================== */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  root: {
    padding: '20px',
  },
  campusCard: {
    marginBottom: '30px',
  },
  campusImage: {
    height: '400px',
    objectFit: 'cover',
  },
  studentCard: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  studentImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '15px',
  },
  actionButtons: {
    marginTop: '20px',
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
  },
  addStudentSection: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
}));

// Take in props data to construct the component
const CampusView = (props) => {
  const {campus, deleteCampus, availableStudents, addStudent, removeStudent} = props;
  const classes = useStyles();
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const handleAddStudent = () => {
    if (selectedStudentId) {
      addStudent(selectedStudentId);
      setSelectedStudentId('');
    }
  };

  // Render a single Campus view with list of its students
  return (
    <div className={classes.root}>
      <Card className={classes.campusCard}>
        {campus.imageUrl && (
          <CardMedia
            component="img"
            className={classes.campusImage}
            image={campus.imageUrl}
            alt={campus.name}
          />
        )}
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom>
            {campus.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            <strong>Address:</strong> {campus.address}
          </Typography>
          {campus.description && (
            <Typography variant="body1" paragraph>
              {campus.description}
            </Typography>
          )}
          
          <Box className={classes.actionButtons}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              component={Link}
              to={`/campus/${campus.id}/edit`}
            >
              Edit Campus
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => deleteCampus(campus.id)}
            >
              Delete Campus
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h4" component="h2" gutterBottom>
        Enrolled Students
      </Typography>

      {campus.students && campus.students.length > 0 ? (
        <Grid container spacing={2}>
          {campus.students.map(student => {
            const name = student.firstname + " " + student.lastname;
            return (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <Card className={classes.studentCard}>
                  <CardContent style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {student.imageUrl && (
                      <img 
                        src={student.imageUrl} 
                        alt={name} 
                        className={classes.studentImage}
                      />
                    )}
                    <Box style={{ flexGrow: 1 }}>
                      <Typography 
                        variant="h6" 
                        component={Link} 
                        to={`/student/${student.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {name}
                      </Typography>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => removeStudent(student.id)}
                      aria-label="remove student"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary" paragraph>
          No students enrolled at this campus.
        </Typography>
      )}

      {availableStudents && availableStudents.length > 0 && (
        <Box className={classes.addStudentSection}>
          <Typography variant="h5" component="h3" gutterBottom>
            Add Student to Campus
          </Typography>
          <Box style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <FormControl style={{ minWidth: '300px' }}>
              <InputLabel>Select Student</InputLabel>
              <Select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                label="Select Student"
              >
                {availableStudents.map(student => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.firstname} {student.lastname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleAddStudent}
              disabled={!selectedStudentId}
            >
              Add Student
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default CampusView;