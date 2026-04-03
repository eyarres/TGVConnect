import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const useTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_URL } = useContext(AuthContext);

  const fetchTrips = async () => {
    try {
      const res = await axios.get(`${API_URL}/mes-billets`);
      setTrips(res.data.data || res.data);
    } catch (e) {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return { trips, loading, refetch: fetchTrips };
};