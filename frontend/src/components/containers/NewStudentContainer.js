/*==================================================
NewStudentContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import NewStudentView from '../views/NewStudentView';
import { addStudentThunk } from '../../store/thunks';

class NewStudentContainer extends Component {
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
        firstname: this.state.firstname.trim(),
        lastname: this.state.lastname.trim(),
        email: this.state.email.trim(),
        imageUrl: this.state.imageUrl.trim() || null,
        gpa: this.state.gpa ? parseFloat(this.state.gpa) : null,
        campusId: this.state.campusId ? parseInt(this.state.campusId) : null
    };
    
    // Add new student in back-end database
    let newStudent = await this.props.addStudent(student);

    // Update state, and trigger redirect to show the new student
    this.setState({
      firstname: "", 
      lastname: "",
      email: "",
      imageUrl: "",
      gpa: "",
      campusId: null, 
      redirect: true, 
      redirectId: newStudent.id,
      errors: {}
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render new student input form
  render() {
    // Redirect to new student's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/student/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    return (
      <div>
        <Header />
        <NewStudentView 
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}
          errors={this.state.errors}
          formData={this.state}
        />
      </div>          
    );
  }
}

// The following input argument is passed to the "connect" function used by "NewStudentContainer" component to connect to Redux Store.
// The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        addStudent: (student) => dispatch(addStudentThunk(student)),
    })
}

// Export store-connected container by default
// NewStudentContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(null, mapDispatch)(NewStudentContainer);