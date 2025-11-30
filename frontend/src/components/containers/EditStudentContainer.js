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
      redirectId: null,
      errors: {}
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

  // Validation function
  validate = () => {
    const errors = {};
    
    if (!this.state.firstname.trim()) {
      errors.firstname = "First name is required";
    }
    
    if (!this.state.lastname.trim()) {
      errors.lastname = "Last name is required";
    }
    
    if (!this.state.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.state.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (this.state.gpa && (parseFloat(this.state.gpa) < 0 || parseFloat(this.state.gpa) > 4.0)) {
      errors.gpa = "GPA must be between 0.0 and 4.0";
    }
    
    if (this.state.campusId && isNaN(parseInt(this.state.campusId))) {
      errors.campusId = "Campus ID must be a valid number";
    }
    
    return errors;
  }

  // Capture input data when it is entered
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      // Clear error for this field when user starts typing
      errors: {
        ...this.state.errors,
        [name]: undefined
      }
    });
  }

  // Take action after user click the submit button
  handleSubmit = async event => {
    event.preventDefault();  // Prevent browser reload/refresh after submit.

    const errors = this.validate();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    let student = {
      id: this.props.student.id,
      firstname: this.state.firstname.trim(),
      lastname: this.state.lastname.trim(),
      email: this.state.email.trim(),
      imageUrl: this.state.imageUrl.trim() || null,
      gpa: this.state.gpa ? parseFloat(this.state.gpa) : null,
      campusId: this.state.campusId ? parseInt(this.state.campusId) : null
    };
    
    // Edit student in back-end database
    let updatedStudent = await this.props.editStudent(student);

    // Update state, and trigger redirect to show the updated student
    this.setState({
      redirect: true, 
      redirectId: updatedStudent.id,
      errors: {}
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
          errors={this.state.errors}
          formData={this.state}
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

