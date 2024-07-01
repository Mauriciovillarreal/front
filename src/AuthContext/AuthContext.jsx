import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      fetch('http://localhost:8080/api/sessions/current', {
        credentials: 'include'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        })
        .catch(error => console.error('Error fetching current user:', error));
    }
  }, []);

  // Add a function to update the user state when logging in with GitHub
  const handleGitHubLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sessions/current', {
        credentials: 'include' // Ensure cookies are sent with the request
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sessions/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Ensure cookies are sent with the request
      });
  
      if (response.ok) {
        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/login'; // Redirigir al login después del logout
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      throw error;
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, login, logout, handleGitHubLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
