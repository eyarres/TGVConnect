import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { ScanQrCode, AlertTriangle, CalendarDays, X, CheckCircle, XCircle } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuth } from '../../hooks/useAuth';
import { useScanner } from '../../hooks/useScanner';

export default function ControllerScreen() {
  const { user, logout } = useAuth();
  
  const [permission, requestPermission] = useCameraPermissions();
  const { isScanning, setIsScanning, loading, scanResult, verifyTicket, resetScanner, closeScanner } = useScanner();

  const handleOpenScanner = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) return alert("Permission refusée. Impossible d'ouvrir la caméra.");
    }
    setIsScanning(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.nom?.charAt(0) || 'C'}</Text>
          </View>
          
          <Text style={styles.adminName}>{user?.nom} {user?.prenom}</Text>
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🛡️ CONTRÔLEUR AGRÉÉ</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>OUTILS DE CONTRÔLE</Text>
        <View style={styles.toolsCard}>
          <View style={styles.toolItem}>
            <TouchableOpacity style={[styles.iconBox, {backgroundColor: '#E3F2FD'}]} onPress={handleOpenScanner}>
              <ScanQrCode color="#2196F3" size={28} />
            </TouchableOpacity>
            <Text style={styles.toolLabel}>Scanner{"\n"}Billet</Text>
          </View>
          <View style={styles.toolItem}>
            <TouchableOpacity style={[styles.iconBox, {backgroundColor: '#FFEBEE'}]}>
              <AlertTriangle color="#F44336" size={28} />
            </TouchableOpacity>
            <Text style={styles.toolLabel}>Incident</Text>
          </View>
          <View style={styles.toolItem}>
            <TouchableOpacity style={[styles.iconBox, {backgroundColor: '#F3E5F5'}]}>
              <CalendarDays color="#9C27B0" size={28} />
            </TouchableOpacity>
            <Text style={styles.toolLabel}>Planning</Text>
          </View>
        </View>

        

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutBtnText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- MODAL DU SCANNER --- */}
      <Modal visible={isScanning} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <Text style={styles.scannerTitle}>Scanner un billet</Text>
            <TouchableOpacity onPress={closeScanner}><X color="white" size={30} /></TouchableOpacity>
          </View>

          {!scanResult ? (
            <View style={styles.cameraWrapper}>
              <CameraView 
                style={styles.camera} 
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={({ data }) => verifyTicket(data)}
              />
              <View style={styles.targetBox} />
              {loading && <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />}
            </View>
          ) : (
            <View style={styles.resultContainer}>
              {scanResult.isValid ? (
                <>
                  <CheckCircle color="#4CAF50" size={100} />
                  <Text style={styles.resultTitleSuccess}>{scanResult.message}</Text>
                  <Text style={styles.resultDetails}>Passager : {scanResult.data?.nom_passager}</Text>
                  <Text style={styles.resultDetails}>Voiture {scanResult.data?.numero_voiture} • Place {scanResult.data?.numero_place}</Text>
                </>
              ) : (
                <>
                  <XCircle color="#F44336" size={100} />
                  <Text style={styles.resultTitleError}>{scanResult.message}</Text>
                  <Text style={styles.resultDetails}>Ce QR Code n'est pas reconnu par le système.</Text>
                </>
              )}
              
              <TouchableOpacity style={styles.rescanBtn} onPress={resetScanner}>
                <Text style={styles.rescanBtnText}>Scanner un autre billet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 40 }, 
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#0D47A1', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  adminName: { fontSize: 24, fontWeight: 'bold', color: '#111', marginBottom: 15 }, 
  badge: { backgroundColor: '#E3F2FD', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#BBDEFB' },
  badgeText: { color: '#0D47A1', fontSize: 12, fontWeight: 'bold' },
  
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#888', marginLeft: 20, marginBottom: 10, marginTop: 10 },
  toolsCard: { backgroundColor: 'white', marginHorizontal: 20, borderRadius: 20, padding: 25, flexDirection: 'row', justifyContent: 'space-between', elevation: 2 },
  toolItem: { alignItems: 'center', flex: 1 },
  iconBox: { width: 55, height: 55, borderRadius: 27, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  toolLabel: { textAlign: 'center', fontSize: 13, fontWeight: 'bold', color: '#333' },
  
  logoutBtn: { backgroundColor: '#FFEBEE', marginHorizontal: 20, marginTop: 50, padding: 18, borderRadius: 15, alignItems: 'center', marginBottom: 40 },
  logoutBtnText: { color: '#F44336', fontWeight: 'bold', fontSize: 16 },

  
  scannerContainer: { flex: 1, backgroundColor: '#000' },
  scannerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#111' },
  scannerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  cameraWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: { ...StyleSheet.absoluteFillObject },
  targetBox: { width: 250, height: 250, borderWidth: 2, borderColor: '#2196F3', backgroundColor: 'transparent' },
  loader: { position: 'absolute' },
  
  resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', padding: 20 },
  resultTitleSuccess: { fontSize: 28, fontWeight: 'bold', color: '#4CAF50', marginTop: 20, marginBottom: 10 },
  resultTitleError: { fontSize: 28, fontWeight: 'bold', color: '#F44336', marginTop: 20, marginBottom: 10 },
  resultDetails: { fontSize: 18, color: '#555', marginBottom: 5, textAlign: 'center' },
  rescanBtn: { marginTop: 40, backgroundColor: '#0D47A1', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30 },
  rescanBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});