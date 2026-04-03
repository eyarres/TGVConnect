import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LogOut, Settings, Bell, ShieldCheck } from 'lucide-react-native';
import { AuthContext } from '../../context/AuthContext'; 

import AuthNavigator from '../../navigation/AuthNavigator'; 

export default function AccountScreen() {
  
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <AuthNavigator />; 
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profilePic}>
          <Text style={styles.initial}>{user?.prenom?.charAt(0) || user?.nom?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.prenom} {user?.nom}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.badge}>
          <ShieldCheck color="#0D47A1" size={14} />
          <Text style={styles.badgeText}>COMPTE VÉRIFIÉ</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Bell color="#333" size={22} />
          <Text style={styles.menuText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Settings color="#333" size={22} />
          <Text style={styles.menuText}>Paramètres</Text>
        </TouchableOpacity>
      </View>

      {/* Le bouton utilise maintenant le vrai logout qui vide le cache et Axios */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <LogOut color="#F44336" size={22} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 30 },
  profilePic: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#B0005E', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  initial: { color: 'white', fontSize: 40, fontWeight: 'bold', textTransform: 'uppercase' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#111', textTransform: 'capitalize' },
  email: { color: '#666', marginBottom: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, gap: 5 },
  badgeText: { color: '#0D47A1', fontSize: 10, fontWeight: 'bold' },
  menu: { backgroundColor: 'white', marginHorizontal: 20, borderRadius: 15, paddingVertical: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuText: { fontSize: 16, color: '#333' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 10 },
  logoutText: { color: '#F44336', fontSize: 16, fontWeight: 'bold' }
});