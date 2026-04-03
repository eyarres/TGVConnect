import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, FlatList } from 'react-native';
import { Home, Map as MapIcon, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSearch } from '../../hooks/useSearch';
import { useGares } from '../../hooks/useGares';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
  const navigation = useNavigation();
  
  const [form, setForm] = useState({ 
    depart: '', 
    arrivee: '', 
    date: new Date().toISOString().split('T')[0],
    departId: null, 
    arriveeId: null 
  });
  
  const [dateObj, setDateObj] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDepartSugg, setShowDepartSugg] = useState(false);
  const [showArriveeSugg, setShowArriveeSugg] = useState(false);
  
  const { executeSearch, loading } = useSearch();
  const { gares } = useGares();

  
  const getGareName = (g) => g.nom || g.nom_gare || g.ville || '';
  const getGareId = (g) => g.id_gare || g.id;

  
  const suggDepart = useMemo(() => {
    if (!form.depart) return [];
    return gares.filter(g => getGareName(g).toLowerCase().includes(form.depart.toLowerCase())).slice(0, 5);
  }, [form.depart, gares]);

  const suggArrivee = useMemo(() => {
    if (!form.arrivee) return [];
    return gares.filter(g => getGareName(g).toLowerCase().includes(form.arrivee.toLowerCase())).slice(0, 5);
  }, [form.arrivee, gares]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateObj(selectedDate);
      setForm({ ...form, date: selectedDate.toISOString().split('T')[0] });
    }
  };

  const handleSearch = async () => {
    console.log("🔍 Recherche lancée avec :", form);
    await executeSearch(form.depart, form.arrivee, form.date);
   
    navigation.navigate('Results', { form });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>TGV Connect</Text></View>
      
      <View style={styles.formCard}>
        <Text style={styles.title}>Où souhaitez-vous aller ?</Text>
        
        
        <View style={{zIndex: 3000}}>
          <View style={styles.inputBox}>
            <Home color="#888" size={20} />
            <TextInput 
              placeholder="Départ" 
              style={styles.input} 
              value={form.depart} 
              onChangeText={t => { setForm({...form, depart: t}); setShowDepartSugg(true); }} 
              onFocus={() => setShowDepartSugg(true)} 
            />
          </View>
          {showDepartSugg && suggDepart.length > 0 && (
            <View style={styles.suggestions}>
              {suggDepart.map((g) => (
                <TouchableOpacity 
                  key={getGareId(g)} 
                  style={styles.suggItem} 
                  onPress={() => { 
                    setForm({...form, depart: getGareName(g), departId: getGareId(g)}); 
                    setShowDepartSugg(false); 
                  }}
                >
                  <Text style={styles.suggText}>{getGareName(g)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{zIndex: 2000, marginTop: 10}}>
          <View style={styles.inputBox}>
            <MapIcon color="#888" size={20} />
            <TextInput 
              placeholder="Arrivée" 
              style={styles.input} 
              value={form.arrivee} 
              onChangeText={t => { setForm({...form, arrivee: t}); setShowArriveeSugg(true); }} 
              onFocus={() => setShowArriveeSugg(true)} 
            />
          </View>
          {showArriveeSugg && suggArrivee.length > 0 && (
            <View style={styles.suggestions}>
              {suggArrivee.map((g) => (
                <TouchableOpacity 
                  key={getGareId(g)} 
                  style={styles.suggItem} 
                  onPress={() => { 
                    setForm({...form, arrivee: getGareName(g), arriveeId: getGareId(g)}); 
                    setShowArriveeSugg(false); 
                  }}
                >
                  <Text style={styles.suggText}>{getGareName(g)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

       
        <TouchableOpacity style={[styles.inputBox, {marginTop: 10}]} onPress={() => setShowDatePicker(true)}>
          <Calendar color="#888" size={20} />
          <Text style={styles.inputText}>{form.date}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dateObj}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Voir les prix</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { backgroundColor: '#B0005E', height: 160, justifyContent: 'center', paddingHorizontal: 20 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 40 },
  formCard: { backgroundColor: 'white', marginHorizontal: 20, marginTop: -40, borderRadius: 16, padding: 20, elevation: 5 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9F9F9', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#EEE' },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  inputText: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },
  button: { backgroundColor: '#B0005E', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  suggestions: { 
    backgroundColor: 'white', 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#EEE', 
    position: 'absolute', 
    top: 50, 
    left: 0, 
    right: 0, 
    zIndex: 5000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  suggText: { fontSize: 16, color: '#333' }
});