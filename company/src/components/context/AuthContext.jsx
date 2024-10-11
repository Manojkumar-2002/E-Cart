import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [company, setCompany] = useState(() => {
    const storedCompany = localStorage.getItem('company');
    return storedCompany ? JSON.parse(storedCompany) : {};
  });

  // Extracting id from company state
  const id = company.id || null; // Default to null if company.id is undefined

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (company && Object.keys(company).length > 0) {
      localStorage.setItem('company', JSON.stringify(company));
    } else {
      localStorage.removeItem('company'); // Clean up local storage if company is empty
    }
  }, [company]);

  const logout = () => {
    setToken(null);
    setCompany({}); // Clear company info on logout
    navigate('/login'); // Navigate to login page after logout
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout, id, company, setCompany }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
