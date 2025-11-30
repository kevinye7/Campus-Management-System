import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './components/ErrorBoundary';

// Redux
import { Provider } from "react-redux";
import store from "./store";

// Router
import { BrowserRouter } from "react-router-dom";

// MUI Theme Provider
import { ThemeProvider } from '@mui/styles';
import { createTheme } from '@mui/material/styles';

// The Provider component makes the Redux Store available to any nested components that need to access the Redux Store. 
// The BrowserRouter component sets a common basename for the nested Routes.
// ThemeProvider makes MUI styles available to components
const container = document.getElementById('root');
const root = createRoot(container);
const theme = createTheme();

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
