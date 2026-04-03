import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export const useReservation = (tripId) => {
  const { API_URL, user } = useContext(AuthContext);
  
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  
  useEffect(() => {
    const fetchPlanSalle = async () => {
      if (!tripId) return;
      try {
        const res = await axios.get(`${API_URL}/voyages/${tripId}/plan`);
        setPlan(res.data);
      } catch (e) {
        console.log("Erreur plan de salle:", e);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchPlanSalle();
  }, [tripId]);

  
  const submitBooking = async (trip, passagerInfo, selectedSeat, onSuccess) => {
    if (!user) {
      Alert.alert("Connexion requise", "Vous devez être connecté pour réserver.");
      return;
    }

    setIsBooking(true);
    try {
      let numeroVoiture = null;
      let numeroPlace = null;
      
      if (selectedSeat) {
        const parts = selectedSeat.split('-');
        numeroVoiture = parseInt(parts[0]);
        numeroPlace = parseInt(parts[1]);
      }

      const payload = {
        passagers: [
          {
            nom: passagerInfo.nom,
            prenom: passagerInfo.prenom,
            voiture: numeroVoiture,
            place: numeroPlace,
          }
        ],
        
        gare_depart_id: trip.gare_depart_id,
        gare_arrivee_id: trip.gare_arrivee_id
      };

      const token = user.token || user.access_token;
      
      const res = await axios.post(`${API_URL}/checkout/${trip.id_voyage || trip.id}`, payload, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (onSuccess) onSuccess();

    } catch (error) {
      console.log("Erreur API paiement:", error.response?.data || error.message);
      Alert.alert("Erreur", "Impossible de finaliser la réservation.");
    } finally {
      setIsBooking(false);
    }
  };

  
  return { plan, loadingPlan, isBooking, submitBooking };
};