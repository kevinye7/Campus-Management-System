import "./App.css";
import { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !isAuthenticated) {
        try {
          await dispatch(fetchCurrentUserThunk());
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [dispatch, isAuthenticated]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Switch>
        <Route exact path="/login" component={LoginContainer} />
        <Route exact path="/">
          {isAuthenticated ? <HomePageContainer /> : <Redirect to="/login" />}
        </Route>
        <ProtectedRoute exact path="/campuses" component={AllCampusesContainer} />
        <ProtectedRoute exact path="/newcampus" component={NewCampusContainer} />
        <ProtectedRoute exact path="/campus/:id" component={CampusContainer} />
        <ProtectedRoute exact path="/campus/:id/edit" component={EditCampusContainer} />
        <ProtectedRoute exact path="/students" component={AllStudentsContainer} />
        <ProtectedRoute exact path="/newstudent" component={NewStudentContainer} />
        <ProtectedRoute exact path="/student/:id" component={StudentContainer} />
        <ProtectedRoute exact path="/student/:id/edit" component={EditStudentContainer} />
        <Route path="*">
          {isAuthenticated ? <Redirect to="/" /> : <Redirect to="/login" />}
        </Route>
      </Switch>        
    </div>
  );
}

export default App;
