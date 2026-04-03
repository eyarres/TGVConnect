import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Train } from 'lucide-react-native';

export default function TripsScreen({ navigation }) {
  
  const availableTrips = [
    { id: '1', depart: 'Paris', arrivee: 'Lyon', heure: '14:30', prix: '45€' },
    { id: '2', depart: 'Paris', arrivee: 'Marseille', heure: '16:00', prix: '89€' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réserver un train</Text>
      
      <FlatList
        data={availableTrips}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('Reservation', { trip: item })}
          >
            <View style={styles.iconContainer}>
              <Train color="#B0005E" size={24} />
            </View>
            <View style={styles.info}>
              <Text style={styles.route}>{item.depart} ➔ {item.arrivee}</Text>
              <Text style={styles.time}>Départ à {item.heure}</Text>
            </View>
            <View style={styles.priceTag}>
              <Text style={styles.price}>{item.prix}</Text>
              <ChevronRight color="#CCC" size={20} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 2 },
  iconContainer: { backgroundColor: '#FFEBEE', padding: 10, borderRadius: 12 },
  info: { flex: 1, marginLeft: 15 },
  route: { fontSize: 16, fontWeight: 'bold' },
  time: { color: '#666', fontSize: 14, marginTop: 2 },
  priceTag: { alignItems: 'flex-end', flexDirection: 'row', gap: 5 },
  price: { color: '#B0005E', fontWeight: 'bold', fontSize: 16 }
});