/*==================================================
HomePageContainer.js

The Container component is responsible for stateful logic and data fetching, and
passes data (if any) as props to the corresponding View component.
If needed, it also defines the component's "connect" function.
================================================== */
import Header from './Header';
import { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllCampusesThunk, fetchAllStudentsThunk } from '../../store/thunks';
import HomePageView from '../views/HomePageView';

class HomePageContainer extends Component {
  // Fetch campuses and students data when component mounts
  componentDidMount() {
    this.props.fetchAllCampuses();
    this.props.fetchAllStudents();
  }

  // Render Home page view by passing data as props to the corresponding View component
  render() {
    return (
      <div>
        <Header />
        <HomePageView 
          campuses={this.props.allCampuses || []}
          students={this.props.allStudents || []}
          user={this.props.user}
        />
      </div>
    );
  }
}

// Map Redux state to component props
const mapState = (state) => {
  return {
    allCampuses: state.allCampuses || [],
    allStudents: state.allStudents || [],
    user: state.auth?.user || null,
  };
};

// Map dispatch actions to component props
const mapDispatch = (dispatch) => {
  return {
    fetchAllCampuses: () => dispatch(fetchAllCampusesThunk()),
    fetchAllStudents: () => dispatch(fetchAllStudentsThunk()),
  };
};

export default connect(mapState, mapDispatch)(HomePageContainer);