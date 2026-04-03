import { useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'; 
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const useTickets = () => {
  const { API_URL, user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
   
    if (!user || !user.token) {
      setReservations([]); 
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/mes-billets`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setReservations(res.data.data || []); 
    } catch (e) {
      console.log("Erreur API Billets:", e.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

 
  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [user])
  );

  return { reservations, loading, refresh: fetchTickets };
};