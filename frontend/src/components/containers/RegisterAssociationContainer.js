/*==================================================
RegisterAssociationContainer.js

Container for public association registration.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import RegisterAssociationView from '../views/RegisterAssociationView';
import axios from 'axios';
import { loginThunk } from '../../store/thunks';

class RegisterAssociationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      associationName: '',
      associationDescription: '',
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      error: null,
      loading: false
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      error: null
    });
  }

  handleSubmit = async (formData) => {
    this.setState({ loading: true, error: null });

    const result = await this.props.registerAssociation(formData);
    
    if (result.success) {
      // Redirect to home
      this.props.history.push('/');
    } else {
      this.setState({ 
        error: result.error || 'Registration failed',
        loading: false 
      });
    }
  }

  render() {
    // Redirect if already authenticated
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <Header />
        <RegisterAssociationView 
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          error={this.state.error}
          loading={this.state.loading}
        />
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    isAuthenticated: state.auth?.isAuthenticated || false,
  };
};

const mapDispatch = (dispatch) => {
  return {
    registerAssociation: (formData) => dispatch(registerAssociationThunk(formData)),
  };
};

export default withRouter(connect(mapState, mapDispatch)(RegisterAssociationContainer));

