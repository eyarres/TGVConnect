import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Plus, Ticket, X, Trash2 } from 'lucide-react-native';
import { useCards, CARD_TYPES } from '../../hooks/useCards';

export default function CardsScreen() {
  const { cards, addCard, removeCard } = useCards();
  const [modalVisible, setModalVisible] = useState(false);
  
  const [selectedType, setSelectedType] = useState('JEUNE');
  const [nomTitulaire, setNomTitulaire] = useState('');
  const [numCarte, setNumCarte] = useState('');

  const handleAddCard = async () => {
    if (!nomTitulaire || !numCarte) {
      return Alert.alert("Erreur", "Veuillez remplir tous les champs.");
    }
    await addCard(selectedType, nomTitulaire.toUpperCase(), numCarte);
    setModalVisible(false);
    setNomTitulaire('');
    setNumCarte('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Cartes</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {cards.length === 0 ? (
          <Text style={styles.emptyText}>Vous n'avez ajouté aucune carte.</Text>
        ) : (
          cards.map(card => (
            <View key={card.id} style={[styles.card, { backgroundColor: card.color }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <TouchableOpacity onPress={() => removeCard(card.id)}>
                  <Trash2 color="white" size={20} opacity={0.7} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.cardNumber}>{card.num}</Text>
              
              <View style={styles.cardFooter}>
                 <View>
                    <Text style={styles.label}>TITULAIRE</Text>
                    <Text style={styles.owner}>{card.user}</Text>
                 </View>

                 
                 {card.type === 'FIDELITE' && (
                   <View>
                      <Text style={styles.label}>CAGNOTTE</Text>
                      <Text style={styles.owner}>
                        {card.solde ? card.solde.toFixed(2) : '0.00'} €
                      </Text>
                   </View>
                 )}
                

              </View>
            </View>
          ))
        )}
      </ScrollView>

      
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle Carte</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#333" size={24}/>
              </TouchableOpacity>
            </View>

          
            <View style={styles.typeSelector}>
              {Object.keys(CARD_TYPES).map((key) => (
                <TouchableOpacity 
                  key={key} 
                  style={[styles.typeBtn, selectedType === key && styles.typeBtnActive]}
                  onPress={() => setSelectedType(key)}
                >
                  <Text style={[styles.typeBtnText, selectedType === key && styles.typeBtnTextActive]}>
                    {CARD_TYPES[key].title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput 
              style={styles.input} 
              placeholder="Nom du titulaire" 
              value={nomTitulaire} 
              onChangeText={setNomTitulaire} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Numéro de la carte" 
              keyboardType="numeric" 
              value={numCarte} 
              onChangeText={setNumCarte} 
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleAddCard}>
              <Text style={styles.submitBtnText}>Ajouter ma carte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#B0005E', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingHorizontal: 20 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 50 },
  card: { borderRadius: 20, padding: 25, marginBottom: 20, elevation: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cardTitle: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  cardNumber: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 25, letterSpacing: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  label: { color: 'white', fontSize: 10, opacity: 0.7, fontWeight: 'bold', marginBottom: 4 },
  owner: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#B0005E' },
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  typeBtn: { padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 8 },
  typeBtnActive: { backgroundColor: '#B0005E', borderColor: '#B0005E' },
  typeBtnText: { color: '#666', fontSize: 12, fontWeight: 'bold' },
  typeBtnTextActive: { color: 'white' },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 15, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  submitBtn: { backgroundColor: '#B0005E', padding: 15, borderRadius: 8, alignItems: 'center' },
  submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});