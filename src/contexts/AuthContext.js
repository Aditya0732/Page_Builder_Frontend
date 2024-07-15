import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { baseurl } from '../constant';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         try {
//           axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//           // Fetch user data
//           const response = await axios.get('http://localhost:5000/api/auth/me');
//           setUser(response.data);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//           localStorage.removeItem('token');
//           delete axios.defaults.headers.common['Authorization'];
//         }
//       }
//       setLoading(false);
//     };

//     initializeAuth();
//   }, []);

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${baseurl}/auth/login`, credentials);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const res = await axios.post(`${baseurl}/auth/signup`, userData);
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};