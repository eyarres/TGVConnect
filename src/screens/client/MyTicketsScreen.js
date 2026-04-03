import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTickets } from '../../hooks/useTickets'; 
import { Zap, Bell } from 'lucide-react-native'; 
import { useNotifications } from '../../hooks/useNotifications'; 

export default function MyTicketsScreen() {
  const { reservations, loading, refresh } = useTickets();
  const [selectedRes, setSelectedRes] = useState(null);
  
  
  const { programmerRappel } = useNotifications();

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color="#B0005E" /></View>
    );
  }

  const renderItem = ({ item }) => {
    const villeDepart = item.gare_depart?.ville || item.voyage?.gare_depart?.ville || 'Départ';
    const villeArrivee = item.gare_arrivee?.ville || item.voyage?.gare_arrivee?.ville || 'Arrivée';
    
    const dateTimeString = item.voyage?.date_depart_reelle;
    let dateDepart = 'Date N/A';
    let heureDepart = '--:--';

    if (dateTimeString) {
      const parts = dateTimeString.split(' '); 
      const dateObj = new Date(dateTimeString);
      dateDepart = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      if (parts[1]) {
        heureDepart = parts[1].substring(0, 5); 
      }
    }

    return (
      <TouchableOpacity style={styles.card} onPress={() => setSelectedRes(item)}>
        <View style={styles.cardContent}>
          <View style={styles.mainInfo}>
            <Text style={styles.routeTitle}>
              {villeDepart} ➔ {villeArrivee}
            </Text>
            <Text style={styles.dateInfo}>
              {dateDepart} • {heureDepart}
            </Text>
            <Text style={styles.trainNumber}>
              TGV {item.voyage?.train?.id_train || 'Connect'}
            </Text>
          </View>
          
          <View style={styles.reminderContainer}>
            <Zap size={20} color="#B0005E" fill="#B0005E" />
            <Text style={styles.reminderText}>Billet</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Voyages</Text>
      <Text style={styles.sectionTitle}>PROCHAINS DÉPARTS</Text>

      <FlatList
        data={reservations} 
        renderItem={renderItem}
        keyExtractor={(item) => (item.id_res || item.id).toString()}
        onRefresh={refresh}
        refreshing={loading}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun voyage réservé pour le moment.</Text>}
      />

      {/* MODAL : DÉTAILS DU BILLET ET QR CODE */}
      <Modal visible={!!selectedRes} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalHeader}>Détails de la réservation</Text>
              
              {selectedRes?.billets?.map((billet, index) => (
                <View key={index} style={styles.qrCard}>
                  <Text style={styles.passagerName}>{billet.prenom_passager} {billet.nom_passager}</Text>
                  <Text style={styles.seatLabel}>Voiture {billet.numero_voiture} • Place {billet.numero_place}</Text>
                  
                  <View style={styles.qrWrapper}>
                    <QRCode value={billet.qr_code} size={200} />
                  </View>

                  
                  <TouchableOpacity 
  style={styles.notifBtn} 
  onPress={() => {
    
    const destination = selectedRes?.voyage?.gare_arrivee?.ville || 
                        selectedRes?.voyage?.arrivee || 
                        "votre destination";

    programmerRappel(
      "Rappel Voyage 🚆",
      `Votre train pour ${destination} partira bientôt ! Préparez votre QR Code.`,
      17
    );
  }}
>
  <Bell color="white" size={18} />
  <Text style={styles.notifBtnText}>M'alerter avant le départ</Text>
</TouchableOpacity>
                  
                  <Text style={styles.qrCodeString}>{billet.qr_code}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedRes(null)}>
              <Text style={styles.closeBtnText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8', paddingHorizontal: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', letterSpacing: 1, marginBottom: 15 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 3 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routeTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', textTransform: 'capitalize', marginBottom: 5 },
  dateInfo: { fontSize: 16, color: '#666', marginVertical: 5 },
  trainNumber: { fontSize: 14, fontWeight: 'bold', color: '#B0005E' },
  reminderContainer: { alignItems: 'center' },
  reminderText: { fontSize: 12, color: '#B0005E', fontWeight: 'bold', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', width: '95%', maxHeight: '85%', borderRadius: 25, padding: 20, alignItems: 'center' },
  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  qrCard: { alignItems: 'center', backgroundColor: '#F0F0F0', padding: 20, borderRadius: 20, marginBottom: 20, width: '100%' },
  passagerName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seatLabel: { fontSize: 15, color: '#B0005E', fontWeight: '600', marginBottom: 15 },
  qrWrapper: { padding: 15, backgroundColor: 'white', borderRadius: 15 },
  qrCodeString: { marginTop: 10, fontSize: 12, color: '#666' },
  closeBtn: { backgroundColor: '#B0005E', padding: 15, borderRadius: 15, width: '100%', alignItems: 'center', marginTop: 10 },
  closeBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

 
  notifBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#B0005E', 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20, 
    marginTop: 20,
    gap: 10
  },
  notifBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 }
});