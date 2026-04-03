import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext'; 

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  
  const { login, API_URL } = useContext(AuthContext); 

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      
      const response = await axios.post(`${API_URL}/login`, {
        email: email,
        password: password
      });

      
      await login(response.data.user, response.data.token);
      
    } catch (err) {
      console.log("Erreur de connexion:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Email ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Connexion</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={styles.loginBtn} 
          onPress={handleLogin} 
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginBtnText}>Se connecter</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.registerBtn}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerBtnText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 30, shadowColor: '#000', shadowOpacity: 0.1, elevation: 5 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#B0005E' },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 15 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  loginBtn: { backgroundColor: '#B0005E', borderRadius: 10, padding: 18, alignItems: 'center', marginTop: 10 },
  loginBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  registerBtn: { marginTop: 25, alignItems: 'center' },
  registerBtnText: { color: '#B0005E', fontWeight: 'bold', fontSize: 16 }
});