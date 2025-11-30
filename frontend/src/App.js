import "./App.css";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//Router
import { Switch, Route, Redirect } from "react-router-dom";
//Components
import {
  HomePageContainer,
  CampusContainer,
  StudentContainer,
  AllCampusesContainer,
  AllStudentsContainer,
  NewStudentContainer,
  NewCampusContainer,
  EditStudentContainer,
  EditCampusContainer
} from './components/containers';
import LoginContainer from './components/containers/LoginContainer';
import ProtectedRoute from './components/ProtectedRoute';
import { fetchCurrentUserThunk } from './store/thunks';

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUserThunk());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="App">
      <Switch>
        <Route exact path="/login" component={LoginContainer} />
        <ProtectedRoute exact path="/" component={HomePageContainer} />
        <ProtectedRoute exact path="/campuses" component={AllCampusesContainer} />
        <ProtectedRoute exact path="/newcampus" component={NewCampusContainer} />
        <ProtectedRoute exact path="/campus/:id" component={CampusContainer} />
        <ProtectedRoute exact path="/campus/:id/edit" component={EditCampusContainer} />
        <ProtectedRoute exact path="/students" component={AllStudentsContainer} />
        <ProtectedRoute exact path="/newstudent" component={NewStudentContainer} />
        <ProtectedRoute exact path="/student/:id" component={StudentContainer} />
        <ProtectedRoute exact path="/student/:id/edit" component={EditStudentContainer} />
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>        
    </div>
  );
}

export default App;
