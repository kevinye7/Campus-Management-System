/*==================================================
LoginContainer.js

The Container component for user login.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import LoginView from '../views/LoginView';
import { loginThunk } from '../../store/thunks';

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
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

    const result = await this.props.login(formData.username, formData.password);
    
    if (result.success) {
      // Redirect handled by checking isAuthenticated in render
      this.setState({ loading: false });
    } else {
      this.setState({ 
        error: result.error || 'Login failed',
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
        <LoginView 
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          error={this.state.error}
          formData={this.state}
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
    login: (username, password) => dispatch(loginThunk(username, password)),
  };
};

export default connect(mapState, mapDispatch)(LoginContainer);

