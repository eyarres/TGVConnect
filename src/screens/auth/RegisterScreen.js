import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register, error, isLoading } = useAuth();
  
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const handleRegister = async () => {
    try {
      await register(form);
    } catch (e) {}
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Créer un compte</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom"
          onChangeText={(val) => setForm({...form, nom: val})}
        />
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          onChangeText={(val) => setForm({...form, prenom: val})}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(val) => setForm({...form, email: val})}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry
          onChangeText={(val) => setForm({...form, password: val})}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmer le mot de passe"
          secureTextEntry
          onChangeText={(val) => setForm({...form, password_confirmation: val})}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>S'inscrire</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
          <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 25, shadowColor: '#000', shadowOpacity: 0.1, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#B0005E' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  btn: { backgroundColor: '#B0005E', borderRadius: 10, padding: 18, alignItems: 'center' },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#B0005E', fontWeight: 'bold' }
});