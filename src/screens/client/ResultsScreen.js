import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSearch } from '../../hooks/useSearch';
import { Users, MapPin, ChevronDown, ChevronUp } from 'lucide-react-native';


const TripCard = ({ item, navigation, form }) => { 
  const [showItinerary, setShowItinerary] = useState(false);

  return (
    <View style={styles.card}>
      
      <TouchableOpacity onPress={() => navigation.navigate('Passenger', { 
          trip: item,
          searchDepartId: form.departId, 
          searchArriveeId: form.arriveeId 
        })}>
        <View style={styles.cardHeader}>
          <Text style={styles.trainName}>TGV {item?.train?.id_train || 'N/A'}</Text>
          <Text style={styles.price}>{item?.prix_base_2 || item?.prix || '0'} €</Text>
        </View>
        <View style={styles.routeContainer}>
          <Text style={styles.time}>{item?.heure_depart_formatee} ➔ {item?.heure_arrivee_formatee}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.infoRow}>
        <View style={styles.badge}>
          <Users size={14} color="#666"/>
          <Text style={styles.badgeText}>{item?.places_dispo_totales || 0} places</Text>
        </View>

        <TouchableOpacity 
          style={styles.itineraryBtn} 
          onPress={() => setShowItinerary(!showItinerary)}
        >
          <MapPin size={14} color="#B0005E" />
          <Text style={styles.itineraryBtnText}>Itinéraire</Text>
          {showItinerary ? <ChevronUp size={14} color="#B0005E"/> : <ChevronDown size={14} color="#B0005E"/>}
        </TouchableOpacity>
      </View>

      {showItinerary && item?.itineraire && (
        <View style={styles.itineraryContainer}>
          <View style={styles.itineraryLine} />
          {item.itineraire.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={[
                styles.stepDot, 
                (index === 0 || index === item.itineraire.length - 1) && styles.stepDotMain 
              ]} />
              <Text style={styles.stepTime}>{step.heure}</Text>
              <Text style={styles.stepGare}>{step.gare}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default function ResultsScreen({ route, navigation }) {
  const { form } = route.params;
  const { executeSearch, results, loading } = useSearch();

  useEffect(() => {
    executeSearch(form.depart, form.arrivee, form.date);
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#B0005E" />
        <Text style={{marginTop: 10}}>Recherche des trajets en cours...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Trajets {form.depart} ➔ {form.arrivee}</Text>
      
      {results && results.length > 0 ? (
        <FlatList 
          data={results} 
          
          renderItem={({ item }) => <TripCard item={item} navigation={navigation} form={form} />}
          keyExtractor={(item, index) => index.toString()} 
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <Text style={styles.noResults}>Aucun trajet trouvé pour cette date.</Text>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20, paddingTop: 60 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  trainName: { fontWeight: 'bold', color: '#B0005E', fontSize: 16 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#B0005E' },
  time: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', padding: 5, borderRadius: 5, gap: 5 },
  badgeText: { fontSize: 12, color: '#666' },
  itineraryBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 5 },
  itineraryBtnText: { color: '#B0005E', fontSize: 14, fontWeight: 'bold' },
  noResults: { fontSize: 16, color: '#888', textAlign: 'center' },
  itineraryContainer: { marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderColor: '#EEE', position: 'relative' },
  itineraryLine: { position: 'absolute', left: 5, top: 25, bottom: 10, width: 2, backgroundColor: '#CCC' },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, paddingLeft: 20, position: 'relative' },
  stepDot: { position: 'absolute', left: 1, width: 10, height: 10, borderRadius: 5, backgroundColor: '#CCC' },
  stepDotMain: { backgroundColor: '#B0005E', width: 12, height: 12, left: 0 },
  stepTime: { fontSize: 14, fontWeight: 'bold', color: '#333', width: 50 },
  stepGare: { fontSize: 14, color: '#555', flex: 1 }
});