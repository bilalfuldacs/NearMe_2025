import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './auth/authContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import EventCreationPage from './pages/EventCreationPage';
import EventDetailsPage from './pages/EventDetailsPage';
import EventRequestPage from './pages/EventRequestPage';
import MessagesPage from './pages/MessagesPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#6c757d',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Protected Routes - Only accessible when logged in */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout>
                    <HomePage events="all" />    
                    </Layout>
                  </ProtectedRoute>
                } 
              />
                   <Route 
                   path="/my-events" 
                   element={
                     <ProtectedRoute>
                       <Layout>
                         <HomePage events="my-events" />
                       </Layout>
                     </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-event" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EventCreationPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <MessagesPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/event/:eventId" 
                element={
                  <ProtectedRoute>
                    <EventDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/event/:eventId/request" 
                element={
                  <ProtectedRoute>
                    <EventRequestPage />
                  </ProtectedRoute>
                } 
              />
              {/* Public Routes - Only accessible when NOT logged in */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <PublicRoute>
                    <SignupPage />
                  </PublicRoute>
                } 
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
