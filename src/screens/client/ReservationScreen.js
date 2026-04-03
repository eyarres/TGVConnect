import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useReservation } from '../../hooks/useReservation';
import { useCards } from '../../hooks/useCards';

export default function ReservationScreen({ route, navigation }) {
  const { trip, passagerInfo, searchDepartId, searchArriveeId } = route.params;
  
  const { plan, loadingPlan, isBooking, submitBooking } = useReservation(trip.id_voyage || trip.id);
  const [selectedSeat, setSelectedSeat] = useState(null);

  
  const { cards, calculateDiscount, updateFideliteAfterBooking } = useCards();
  const [selectedCardId, setSelectedCardId] = useState(null);

  
  const prixDeBaseAffiche = parseFloat(trip.prix_base_2) + (selectedSeat ? 5 : 0);
  const carteAffichee = cards.find(c => c.id === selectedCardId);
  const prixFinalAffiche = calculateDiscount(prixDeBaseAffiche, carteAffichee);
  
 
  const reductionAppliquee = prixDeBaseAffiche - prixFinalAffiche;

  const handleConfirmPress = () => {
    const finalTripData = {
      ...trip,
      gare_depart_id: searchDepartId || trip.gare_depart_id,
      gare_arrivee_id: searchArriveeId || trip.gare_arrivee_id,
    };

    Alert.alert(
      "Confirmation de paiement", 
      `Billet : ${prixDeBaseAffiche.toFixed(2)}€\nTotal à payer : ${prixFinalAffiche.toFixed(2)}€\nConfirmer l'achat ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Payer", 
          onPress: () => submitBooking(finalTripData, passagerInfo, selectedSeat, async () => {
            
            await updateFideliteAfterBooking(prixFinalAffiche, selectedCardId, reductionAppliquee);
            
            Alert.alert("Succès 🎉", "Votre billet a été généré !");
            navigation.navigate('SearchMain'); 
          }) 
        }
      ]
    );
  };

  if (loadingPlan || isBooking) return <ActivityIndicator size="large" color="#B0005E" style={{flex: 1, marginTop: 50}} />;

  const renderCarriages = () => {
    if (!plan) return <Text style={{marginTop: 20}}>Chargement du plan...</Text>;
    let carriages = [];
    for (let v = 1; v <= plan.nb_voitures; v++) {
      let seats = [];
      for (let i = 1; i <= plan.places_par_voiture; i++) {
        const seatId = `${v}-${i}`;
        const isOccupied = plan.places_occupees.includes(seatId);
        const isSelected = selectedSeat === seatId;
        seats.push(
          <TouchableOpacity 
            key={seatId} disabled={isOccupied}
            style={[styles.seat, isOccupied ? styles.seatOccupied : (isSelected ? styles.seatSelected : styles.seatFree)]}
            onPress={() => setSelectedSeat(seatId)}
          >
            <Text style={[styles.seatText, (isOccupied || isSelected) && styles.seatTextWhite]}>{i}</Text>
          </TouchableOpacity>
        );
      }
      carriages.push(
        <View key={`voiture-${v}`} style={styles.carriageContainer}>
          <Text style={styles.carTitle}>Voiture {v}</Text>
          <View style={styles.seatGrid}>{seats}</View>
        </View>
      );
    }
    return carriages;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choix de la place</Text>
        <Text style={styles.subtitle}>TGV {trip.train?.id_train || trip.train_id}</Text>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}><View style={[styles.legendBox, styles.seatFree]} /><Text>Libre</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendBox, styles.seatOccupied]} /><Text>Occupé</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendBox, styles.seatSelected]} /><Text>Votre choix</Text></View>
      </View>

      <ScrollView contentContainerStyle={styles.trainScroll}>
        {renderCarriages()}
      </ScrollView>

      
      <View style={styles.discountContainer}>
        <Text style={styles.discountLabel}>Appliquer une réduction :</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 10, paddingRight: 20}}>
          <TouchableOpacity 
             style={[styles.cardBtn, !selectedCardId && styles.cardBtnActive]} 
             onPress={() => setSelectedCardId(null)}>
             <Text style={[styles.cardBtnText, !selectedCardId && styles.cardBtnTextActive]}>Aucune</Text>
          </TouchableOpacity>
          
          {cards.map(card => {
            
            const isFideliteBloquee = card.type === 'FIDELITE' && card.solde < 5;

            return (
              <TouchableOpacity 
                key={card.id} 
                disabled={isFideliteBloquee} 
                style={[
                  styles.cardBtn, 
                  selectedCardId === card.id && styles.cardBtnActive,
                  selectedCardId === card.id && { backgroundColor: card.color, borderColor: card.color },
                  isFideliteBloquee && { opacity: 0.4 } 
                ]}
                onPress={() => setSelectedCardId(card.id)}>
                <Text style={[styles.cardBtnText, selectedCardId === card.id && styles.cardBtnTextActive]}>
                  {card.title} {isFideliteBloquee ? `(${card.solde.toFixed(2)}€ / 5€)` : ''}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          {selectedCardId && (
            <Text style={styles.oldPrice}>{prixDeBaseAffiche.toFixed(2)} €</Text>
          )}
          <Text style={styles.totalPrice}>
            {prixFinalAffiche.toFixed(2)} €
          </Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={handleConfirmPress} disabled={isBooking}>
          <Text style={styles.bookBtnText}>Payer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 50 },
  header: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#EEE' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#B0005E' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  legendContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: 'white' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendBox: { width: 15, height: 15, borderRadius: 3 },
  trainScroll: { padding: 20, alignItems: 'center', paddingBottom: 40 },
  carriageContainer: { marginBottom: 30, alignItems: 'center' },
  carTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  seatGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: 220, gap: 10 },
  seat: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 1 },
  seatFree: { backgroundColor: 'white', borderColor: '#CCC' },
  seatOccupied: { backgroundColor: '#E0E0E0', borderColor: '#CCC' },
  seatSelected: { backgroundColor: '#B0005E', borderColor: '#B0005E' },
  seatText: { fontWeight: 'bold', color: '#333' },
  seatTextWhite: { color: 'white' },
  discountContainer: { backgroundColor: 'white', paddingVertical: 15, paddingLeft: 20, borderTopWidth: 1, borderColor: '#EEE' },
  discountLabel: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  cardBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#DDD', backgroundColor: 'white' },
  cardBtnActive: { backgroundColor: '#B0005E', borderColor: '#B0005E' },
  cardBtnText: { fontSize: 12, fontWeight: 'bold', color: '#666' },
  cardBtnTextActive: { color: 'white' },
  footer: { backgroundColor: 'white', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderColor: '#EEE' },
  totalLabel: { color: '#666', fontSize: 14 },
  oldPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through', marginBottom: -5 },
  totalPrice: { fontSize: 24, fontWeight: 'bold', color: '#B0005E' },
  bookBtn: { backgroundColor: '#B0005E', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 10 },
  bookBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});