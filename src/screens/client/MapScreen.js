import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PhoneCall, Navigation, Plus, X } from 'lucide-react-native';
import { useMapLogic } from '../../hooks/useMapLogic'; 

export default function MapScreen() {
  const { 
    filteredPlaces, activeTab, setActiveTab, userLocation, 
    addPlace, callSOS, openItinerary 
  } = useMapLogic();

  
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [nom, setNom] = useState('');
  const [desc, setDesc] = useState('');
  const [adresse, setAdresse] = useState('');

  const handleAddSubmit = async () => {
    if (!nom || !adresse) return alert("Le nom et l'adresse sont obligatoires.");
    setIsAdding(true);
    const success = await addPlace(activeTab, nom, desc, adresse);
    setIsAdding(false);
    
    if (success) {
      setModalVisible(false);
      setNom(''); setDesc(''); setAdresse('');
    }
  };

  return (
    <View style={styles.container}>
     
      <MapView 
        style={styles.map}
        showsUserLocation={true} 
        showsMyLocationButton={true}
        initialRegion={{
          latitude: userLocation?.latitude || 48.8566,
          longitude: userLocation?.longitude || 2.3522,
          latitudeDelta: 0.1, longitudeDelta: 0.1,
        }}
      >
        {filteredPlaces.map(place => (
          <Marker 
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.nom}
            description={place.desc}
            pinColor={activeTab === 'Gares' ? '#B0005E' : activeTab === 'Hôtels' ? '#2196F3' : '#FF9800'}
          />
        ))}
      </MapView>
      
      
      <TouchableOpacity style={styles.sosBtn} onPress={callSOS}>
        <PhoneCall color="white" size={20} />
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
        <Plus color="white" size={28} />
      </TouchableOpacity>

      
      <View style={styles.panel}>
        <View style={styles.tabs}>
           {['Gares', 'Hôtels', 'Location'].map(tab => (
             <TouchableOpacity 
               key={tab}
               style={[styles.tab, activeTab === tab && styles.activeTab]}
               onPress={() => setActiveTab(tab)}
             >
               <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>{tab}</Text>
             </TouchableOpacity>
           ))}
        </View>

        <FlatList 
          data={filteredPlaces}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.empty}>Aucun lieu enregistré dans cette catégorie.</Text>}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.gareItem} onPress={() => openItinerary(item.latitude, item.longitude)}>
               <View>
                  <Text style={styles.gareNom}>{item.nom}</Text>
                  <Text style={styles.gareDesc}>{item.desc}</Text>
               </View>
               <View style={styles.navAction}>
                 <Text style={styles.navText}>Y aller</Text>
                 <Navigation color="#B0005E" size={20} />
               </View>
            </TouchableOpacity>
          )}
        />
      </View>

      
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter dans {activeTab}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><X color="#333" size={24}/></TouchableOpacity>
            </View>

            <TextInput style={styles.input} placeholder="Nom (ex: Hôtel Ritz)" value={nom} onChangeText={setNom} />
            <TextInput style={styles.input} placeholder="Description (ex: 5 étoiles)" value={desc} onChangeText={setDesc} />
            <TextInput style={styles.input} placeholder="Adresse complète (Ville, Rue...)" value={adresse} onChangeText={setAdresse} />

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddSubmit} disabled={isAdding}>
              {isAdding ? <ActivityIndicator color="white" /> : <Text style={styles.submitBtnText}>Ajouter sur la carte</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  sosBtn: { position: 'absolute', top: 60, right: 20, backgroundColor: '#E53935', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, elevation: 5 },
  sosText: { color: 'white', fontWeight: 'bold', fontSize: 18, marginLeft: 10 },
  addBtn: { position: 'absolute', top: 130, right: 20, backgroundColor: '#2196F3', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  panel: { backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, height: '45%', position: 'absolute', bottom: 0, width: '100%', elevation: 15 },
  tabs: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 15, padding: 5, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  activeTab: { backgroundColor: '#B0005E' },
  activeTabText: { color: 'white', fontWeight: 'bold' },
  tabText: { color: '#666', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
  gareItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  gareNom: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  gareDesc: { color: '#888', marginTop: 2 },
  navAction: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FCE4EC', padding: 10, borderRadius: 20 },
  navText: { color: '#B0005E', fontWeight: 'bold', fontSize: 12 },
  
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', padding: 25, borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#B0005E' },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  submitBtn: { backgroundColor: '#B0005E', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});