import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

export const useSearch = () => {
  const { API_URL } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => { loadHistory(); }, []);

  const loadHistory = async () => {
    const saved = await AsyncStorage.getItem('searchHistory');
    if (saved) setHistory(JSON.parse(saved));
  };

  const executeSearch = async (depart, arrivee, date) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/search`, {
        params: { gare_depart: depart, gare_arrivee: arrivee, date: date }
      });
      
      setResults(res.data.data || res.data);
      
      const newHistory = [{ depart, arrivee }, ...history.filter(h => h.depart !== depart)].slice(0, 3);
      setHistory(newHistory);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { executeSearch, results, loading, history, setResults };
};