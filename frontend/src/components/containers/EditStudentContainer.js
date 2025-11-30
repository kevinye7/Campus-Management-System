/*==================================================
EditStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import EditStudentView from '../views/EditStudentView';
import { editStudentThunk, fetchStudentThunk } from '../../store/thunks';

class EditStudentContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      firstname: "", 
      lastname: "",
      email: "",
      imageUrl: "",
      gpa: "",
      campusId: null,
      redirect: false, 
      redirectId: null
    };
  }

  // Get student data from back-end database
  componentDidMount() {
    // Getting student ID from URL
    this.props.fetchStudent(this.props.match.params.id);
  }

  // Update state when student data is loaded
  componentDidUpdate(prevProps) {
    // Check if student data has been loaded
    if (prevProps.student !== this.props.student && this.props.student.id) {
      this.setState({
        firstname: this.props.student.firstname || "",
        lastname: this.props.student.lastname || "",
        email: this.props.student.email || "",
        imageUrl: this.props.student.imageUrl || "",
        gpa: this.props.student.gpa || "",
        campusId: this.props.student.campusId || (this.props.student.campus ? this.props.student.campus.id : null)
      });
    }
  }

  // Capture input data when it is entered
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.

    let student = {
      id: this.props.student.id,
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      imageUrl: this.state.imageUrl || null,
      gpa: this.state.gpa ? parseFloat(this.state.gpa) : null,
      campusId: this.state.campusId ? parseInt(this.state.campusId) : null
    };
    
    // Edit student in back-end database
    let updatedStudent = await this.props.editStudent(student);

    // Update state, and trigger redirect to show the updated student
    this.setState({
      redirect: true, 
      redirectId: updatedStudent.id
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render edit student input form
  render() {
    // Redirect to student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    // Only render form if student data is loaded
    if (!this.props.student || !this.props.student.id) {
      return (
        <div>
          <Header />
          <div>Loading...</div>
        </div>
      );
    }

    return (
      <div>
        <Header />
        <EditStudentView 
          student={this.props.student}
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}      
        />
      </div>          
    );
  }
}

// The following 2 input arguments are passed to the "connect" function used by "EditStudentContainer" component to connect to Redux Store.
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "student".
const mapState = (state) => {
  return {
    student: state.student,  // Get the State object from Reducer "student"
  };
};
// 2. The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        fetchStudent: (id) => dispatch(fetchStudentThunk(id)),
        editStudent: (student) => dispatch(editStudentThunk(student)),
    })
}

// Export store-connected container by default
// EditStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditStudentContainer);

