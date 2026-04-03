import { useState, useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DEFAULT_PLACES = [
  { id: '1', type: 'Gares', nom: 'Gare du Nord', desc: 'TGV, Eurostar, Thalys', latitude: 48.8809, longitude: 2.3553 },
  { id: '2', type: 'Gares', nom: 'Gare de Lyon', desc: 'TGV Sud-Est, TER', latitude: 48.8443, longitude: 2.3744 },
];

export const useMapLogic = () => {
  const [places, setPlaces] = useState([]);
  const [activeTab, setActiveTab] = useState('Gares');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    loadPlaces();
    getUserLocation();
  }, []);

  
  const loadPlaces = async () => {
    try {
      const saved = await AsyncStorage.getItem('@map_places');
      if (saved) setPlaces(JSON.parse(saved));
      else setPlaces(DEFAULT_PLACES);
    } catch (e) { console.error("Erreur de chargement", e); }
  };

 
  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Activez la localisation pour voir les itinéraires.');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);
  };

  
  const addPlace = async (type, nom, desc, address) => {
    try {
      const geocoded = await Location.geocodeAsync(address);
      if (geocoded.length > 0) {
        const newPlace = {
          id: Date.now().toString(),
          type, nom, desc,
          latitude: geocoded[0].latitude,
          longitude: geocoded[0].longitude
        };
        const updated = [...places, newPlace];
        setPlaces(updated);
        await AsyncStorage.setItem('@map_places', JSON.stringify(updated));
        return true; 
      } else {
        Alert.alert('Erreur', 'Adresse introuvable sur la carte.');
        return false;
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de chercher cette adresse.');
      return false;
    }
  };

 
  const callSOS = () => {
    Linking.openURL('tel:112'); 
  };

  
  const openItinerary = (destLat, destLng) => {
    if (!userLocation) {
      return Alert.alert('Erreur', 'Votre position GPS est introuvable.');
    }
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${destLat},${destLng}`;
    Linking.openURL(url);
  };

  const filteredPlaces = places.filter(p => p.type === activeTab);

  return { 
    places, filteredPlaces, activeTab, setActiveTab, userLocation, 
    addPlace, callSOS, openItinerary 
  };
};