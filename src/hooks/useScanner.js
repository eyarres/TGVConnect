import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export const useScanner = () => {
  const { API_URL, user } = useContext(AuthContext);
  
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null); 

  const verifyTicket = async (qrCodeData) => {
    
    if (loading || scanResult) return; 

    setLoading(true);
    try {
      const token = user?.token || user?.access_token;
      
      
      const response = await axios.post(`${API_URL}/billets/verify`, 
        { qr_code: qrCodeData },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      
      setScanResult({
        isValid: true,
        data: response.data.billet,
        message: "Billet Valide"
      });

    } catch (error) {
      
      setScanResult({
        isValid: false,
        data: null,
        message: error.response?.data?.message || "Faux Billet ou Invalide"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
  };

  const closeScanner = () => {
    setIsScanning(false);
    setScanResult(null);
  };

  return { 
    isScanning, 
    setIsScanning, 
    loading, 
    scanResult, 
    verifyTicket, 
    resetScanner, 
    closeScanner 
  };
};