import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function PassengerScreen({ route, navigation }) {
  
  const { trip, searchDepartId, searchArriveeId } = route.params;
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');

  const handleNext = () => {
    if (!nom || !prenom) {
      return Alert.alert("Erreur", "Veuillez remplir votre nom et prénom.");
    }
    
    
    navigation.navigate('Reservation', { 
      trip: trip, 
      passagerInfo: { nom, prenom },
      searchDepartId: searchDepartId, 
      searchArriveeId: searchArriveeId  
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informations Voyageur</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Prénom</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Jean" 
          value={prenom} 
          onChangeText={setPrenom} 
        />

        <Text style={styles.label}>Nom</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Dupont" 
          value={nom} 
          onChangeText={setNom} 
        />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleNext}>
        <Text style={styles.btnText}>Continuer vers le Choix de Place</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#F5F5F5' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#B0005E', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 2 },
  label: { fontSize: 16, color: '#333', marginTop: 10, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 10, borderRadius: 8, fontSize: 16 },
  btn: { backgroundColor: '#B0005E', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});