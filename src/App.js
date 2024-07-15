import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Workspace from './Pages/Workspace';
// import { useAuth } from './contexts/AuthContext';

function App() {
  // const auth = useAuth();

  // if (auth.loading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-yellow-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/workspace/:id" element={<PrivateRoute><Workspace /></PrivateRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;