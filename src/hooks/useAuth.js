import { useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { setUser, API_URL } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user: userData } = res.data;
      const fullUser = { 
        ...userData, 
        role: userData.role 
      };
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(fullUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(fullUser);
    } catch (e) {
      setError("Identifiants incorrects");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      const { token, user: newUser } = res.data;
      const fullUser = { 
        ...newUser, 
        role: newUser.role || 'client' 
      };
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(fullUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(fullUser);
    } catch (e) {
      setError(e.response?.data?.message || "Erreur lors de l'inscription");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (e) {}
  };

  return { login, register, logout, error, isLoading };
};