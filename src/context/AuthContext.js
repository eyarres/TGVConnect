import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = 'http://10.11.37.84/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');
      
      if (token && storedUser) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const userWithToken = {
          ...JSON.parse(storedUser),
          token: token 
        };
        
        setUser(userWithToken);
      }
    } catch (e) {
      console.log("Erreur checkToken:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

 
  const login = async (userData, token) => {
    try {
      
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
     
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      
      setUser({ ...userData, token });
    } catch (e) {
      console.log("Erreur sauvegarde login:", e);
    }
  };

  
  const logout = async () => {
    try {
      
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      
      
      delete axios.defaults.headers.common['Authorization'];
      
      
      setUser(null);
    } catch (e) {
      console.log("Erreur logout:", e);
    }
  };

  return (
    
    <AuthContext.Provider value={{ user, setUser, loading, API_URL, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};