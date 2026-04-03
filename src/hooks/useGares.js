import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const useGares = () => {
  const { API_URL } = useContext(AuthContext);
  const [gares, setGares] = useState([]);

  useEffect(() => {
    const fetchGares = async () => {
      try {
        const res = await axios.get(`${API_URL}/gares`);
        setGares(res.data.data || res.data);
      } catch (e) {
        setGares([]);
      }
    };
    fetchGares();
  }, []);

  return { gares };
};