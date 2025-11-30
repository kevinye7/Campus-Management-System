/*==================================================
CampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { fetchCampusThunk, deleteCampusThunk, fetchAllStudentsThunk, editStudentThunk } from "../../store/thunks";

import { CampusView } from "../views";

class CampusContainer extends Component {
  // Get the specific campus data from back-end database
  componentDidMount() {
    // Get campus ID from URL (API link)
    this.props.fetchCampus(this.props.match.params.id);
    // Fetch all students to show in dropdown
    this.props.fetchAllStudents();
  }

  // Handle campus deletion
  handleDelete = async (campusId) => {
    await this.props.deleteCampus(campusId);
    // Redirect to all campuses view after deletion
    this.props.history.push('/campuses');
  }

  // Handle adding a student to this campus
  handleAddStudent = async (studentId) => {
    const student = this.props.allStudents.find(s => s.id === parseInt(studentId));
    if (student) {
      const updatedStudent = {
        ...student,
        campusId: this.props.campus.id
      };
      await this.props.editStudent(updatedStudent);
      // Refresh campus data to show updated student list
      this.props.fetchCampus(this.props.match.params.id);
    }
  }

  // Handle removing a student from this campus
  handleRemoveStudent = async (studentId) => {
    const student = this.props.allStudents.find(s => s.id === studentId);
    if (student) {
      const updatedStudent = {
        ...student,
        campusId: null
      };
      await this.props.editStudent(updatedStudent);
      // Refresh campus data to show updated student list
      this.props.fetchCampus(this.props.match.params.id);
    }
  }

  // Render a Campus view by passing campus data as props to the corresponding View component
  render() {
    // Filter out students already enrolled in this campus
    const enrolledStudentIds = this.props.campus?.students?.map(s => s.id) || [];
    const availableStudents = this.props.allStudents.filter(
      student => !enrolledStudentIds.includes(student.id)
    );

    return (
      <div>
        <Header />
        <CampusView 
          campus={this.props.campus} 
          deleteCampus={this.handleDelete}
          availableStudents={availableStudents}
          addStudent={this.handleAddStudent}
          removeStudent={this.handleRemoveStudent}
        />
      </div>
    );
  }
}

// The following 2 input arguments are passed to the "connect" function used by "CampusContainer" component to connect to Redux Store.
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "campus".
const mapState = (state) => {
  return {
    campus: state.campus,  // Get the State object from Reducer "campus"
    allStudents: state.allStudents,  // Get all students for dropdown
  };
};
// 2. The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
  return {
    fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
    deleteCampus: (campusId) => dispatch(deleteCampusThunk(campusId)),
    fetchAllStudents: () => dispatch(fetchAllStudentsThunk()),
    editStudent: (student) => dispatch(editStudentThunk(student)),
  };
};

// Export store-connected container by default
// CampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default withRouter(connect(mapState, mapDispatch)(CampusContainer));