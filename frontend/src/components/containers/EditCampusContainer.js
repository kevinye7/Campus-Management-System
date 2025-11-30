/*==================================================
EditCampusContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import EditCampusView from '../views/EditCampusView';
import { editCampusThunk, fetchCampusThunk } from '../../store/thunks';

class EditCampusContainer extends Component {
  // Initialize state
  constructor(props){
    super(props);
    this.state = {
      name: "", 
      address: "",
      description: "",
      imageUrl: "",
      redirect: false, 
      redirectId: null,
      errors: {}
    };
  }

  // Get campus data from back-end database
  componentDidMount() {
    // Getting campus ID from URL
    this.props.fetchCampus(this.props.match.params.id);
  }

  // Update state when campus data is loaded
  componentDidUpdate(prevProps) {
    // Check if campus data has been loaded
    if (prevProps.campus !== this.props.campus && this.props.campus.id) {
      this.setState({
        name: this.props.campus.name || "",
        address: this.props.campus.address || "",
        description: this.props.campus.description || "",
        imageUrl: this.props.campus.imageUrl || ""
      });
    }
  }

  // Validation function
  validate = () => {
    const errors = {};
    
    if (!this.state.name.trim()) {
      errors.name = "Campus name is required";
    }
    
    if (!this.state.address.trim()) {
      errors.address = "Address is required";
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

    let campus = {
      id: this.props.campus.id,
      name: this.state.name.trim(),
      address: this.state.address.trim(),
      description: this.state.description.trim() || null,
      imageUrl: this.state.imageUrl.trim() || null
    };
    
    // Edit campus in back-end database
    let updatedCampus = await this.props.editCampus(campus);

    // Update state, and trigger redirect to show the updated campus
    this.setState({
      redirect: true, 
      redirectId: updatedCampus.id,
      errors: {}
    });
  }

  // Unmount when the component is being removed from the DOM:
  componentWillUnmount() {
      this.setState({redirect: false, redirectId: null});
  }

  // Render edit campus input form
  render() {
    // Redirect to campus's page after submit
    if(this.state.redirect) {
      return (<Redirect to={`/campus/${this.state.redirectId}`}/>)
    }

    // Display the input form via the corresponding View component
    // Only render form if campus data is loaded
    if (!this.props.campus || !this.props.campus.id) {
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
        <EditCampusView 
          campus={this.props.campus}
          handleChange = {this.handleChange} 
          handleSubmit={this.handleSubmit}
          errors={this.state.errors}
          formData={this.state}
        />
      </div>          
    );
  }
}

// The following 2 input arguments are passed to the "connect" function used by "EditCampusContainer" component to connect to Redux Store.
// 1. The "mapState" argument specifies the data from Redux Store that the component needs.
// The "mapState" is called when the Store State changes, and it returns a data object of "campus".
const mapState = (state) => {
  return {
    campus: state.campus,  // Get the State object from Reducer "campus"
  };
};
// 2. The "mapDispatch" argument is used to dispatch Action (Redux Thunk) to Redux Store.
// The "mapDispatch" calls the specific Thunk to dispatch its action. The "dispatch" is a function of Redux Store.
const mapDispatch = (dispatch) => {
    return({
        fetchCampus: (id) => dispatch(fetchCampusThunk(id)),
        editCampus: (campus) => dispatch(editCampusThunk(campus)),
    })
}

// Export store-connected container by default
// EditCampusContainer uses "connect" function to connect to Redux Store and to read values from the Store 
// (and re-read the values when the Store State updates).
export default connect(mapState, mapDispatch)(EditCampusContainer);

