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

const useStyles = makeStyles(theme => ({
  root: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  campusCard: {
    marginBottom: '30px',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  campusImage: {
    height: '400px',
    objectFit: 'cover',
    width: '100%',
  },
  campusTitle: {
    color: '#1d1d1f',
    fontWeight: 600,
  },
  campusText: {
    color: '#666666',
  },
  studentCard: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 2px 16px 0 rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.1)',
    },
  },
  studentImage: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '15px',
  },
  studentName: {
    color: '#1d1d1f',
    fontWeight: 500,
    textDecoration: 'none !important',
    '&:hover': {
      color: '#000000',
    },
  },
  sectionTitle: {
    color: '#1d1d1f',
    fontWeight: 600,
    marginBottom: '20px',
    marginTop: '20px',
  },
  actionButtons: {
    marginTop: '20px',
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
  deleteButton: {
    background: 'rgba(0, 0, 0, 0.08) !important',
    color: '#666666 !important',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.12) !important',
      color: '#1d1d1f !important',
    },
  },
  addStudentSection: {
    marginTop: '30px',
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.08)',
  },
  addStudentTitle: {
    color: '#1d1d1f',
    fontWeight: 600,
    marginBottom: '20px',
  },
  emptyText: {
    color: '#666666',
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
        <CardContent style={{ padding: '24px' }}>
          <Typography variant="h3" component="h1" className={classes.campusTitle} gutterBottom>
            {campus.name}
          </Typography>
          <Typography variant="body1" className={classes.campusText} paragraph>
            <strong>Address:</strong> {campus.address}
          </Typography>
          {campus.description && (
            <Typography variant="body1" className={classes.campusText} paragraph>
              {campus.description}
            </Typography>
          )}
          
          <Box className={classes.actionButtons}>
            <Button
              className={classes.actionButton}
              startIcon={<EditIcon />}
              component={Link}
              to={`/campus/${campus.id}/edit`}
            >
              Edit Campus
            </Button>
            <Button
              className={`${classes.actionButton} ${classes.deleteButton}`}
              startIcon={<DeleteIcon />}
              onClick={() => deleteCampus(campus.id)}
            >
              Delete Campus
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h4" component="h2" className={classes.sectionTitle}>
        Enrolled Students
      </Typography>

      {campus.students && campus.students.length > 0 ? (
        <Grid container spacing={2}>
          {campus.students.map(student => {
            const name = student.firstname + " " + student.lastname;
            return (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <Card className={classes.studentCard}>
                  <CardContent style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '16px' }}>
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
                        className={classes.studentName}
                      >
                        {name}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() => removeStudent(student.id)}
                      aria-label="remove student"
                      style={{ color: '#666666' }}
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
        <Typography variant="body1" className={classes.emptyText} paragraph>
          No students enrolled at this campus.
        </Typography>
      )}

      {availableStudents && availableStudents.length > 0 && (
        <Box className={classes.addStudentSection}>
          <Typography variant="h5" component="h3" className={classes.addStudentTitle}>
            Add Student to Campus
          </Typography>
          <Box style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl style={{ minWidth: '250px', flex: 1 }}>
              <InputLabel>Select Student</InputLabel>
              <Select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                label="Select Student"
                style={{ background: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px' }}
              >
                {availableStudents.map(student => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.firstname} {student.lastname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              className={classes.actionButton}
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