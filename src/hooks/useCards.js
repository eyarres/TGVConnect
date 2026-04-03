import { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext'; 

export const CARD_TYPES = {
  JEUNE: { type: 'JEUNE', title: 'AVANTAGE JEUNE', color: '#FFB300', discount: 0.20 },
  MAX: { type: 'MAX', title: 'TGV MAX', color: '#C2185B', discount: 0.35 },
  FIDELITE: { type: 'FIDELITE', title: 'CARTE FIDÉLITÉ', color: '#1E1E1E', discount: 0, solde: 0 }
};

export const useCards = () => {
  const { user } = useContext(AuthContext); 
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = user?.id_user || user?.id || 'guest';
  const STORAGE_KEY = `@mes_cartes_${userId}`;

  useEffect(() => {
    if (user) loadCards();
    else setCards([]);
  }, [user]);

  const loadCards = async () => {
    setLoading(true);
    try {
      const storedCards = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCards) setCards(JSON.parse(storedCards));
      else setCards([]); 
    } catch (e) {
      console.log("Erreur chargement cartes:", e);
    } finally {
      setLoading(false);
    }
  };

  const addCard = async (typeKey, nomProprietaire, num) => {
    const template = CARD_TYPES[typeKey];
    const newCard = {
      id: Date.now().toString(),
      type: template.type,
      title: template.title,
      color: template.color,
      discount: template.discount,
      user: nomProprietaire,
      num: num,
      
      solde: template.type === 'FIDELITE' ? 0 : null 
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
  };

  const removeCard = async (id) => {
    const updatedCards = cards.filter(c => c.id !== id);
    setCards(updatedCards);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
  };

  const calculateDiscount = (prixBase, selectedCard) => {
    if (!selectedCard) return prixBase;

    
    if (selectedCard.discount > 0) {
      return prixBase - (prixBase * selectedCard.discount);
    }

    if (selectedCard.type === 'FIDELITE' && selectedCard.solde >= 5) {
      const nouveauPrix = prixBase - selectedCard.solde;
      return nouveauPrix > 0 ? nouveauPrix : 0;
    }

    return prixBase;
  };

  
  const updateFideliteAfterBooking = async (prixPaye, carteUtiliseeId, reductionAppliquee) => {
    try {
      
      const storedCards = await AsyncStorage.getItem(STORAGE_KEY);
      let currentCards = storedCards ? JSON.parse(storedCards) : cards;

      const updatedCards = currentCards.map(c => {
        
        let nouveauSolde = parseFloat(c.solde) || 0;

        
        if (c.id === carteUtiliseeId && c.type === 'FIDELITE') {
          nouveauSolde -= parseFloat(reductionAppliquee || 0);
          if (nouveauSolde < 0) nouveauSolde = 0;
        }

        
        if (c.type === 'FIDELITE') {
          const ajout = parseFloat(prixPaye) * 0.005;
          nouveauSolde += ajout;
        }

        return { ...c, solde: nouveauSolde };
      });

     
      setCards(updatedCards);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
      console.log("✅ Cagnotte mise à jour avec succès !");
      
    } catch (e) {
      console.log("❌ Erreur lors de la mise à jour de la cagnotte :", e);
    }
  };

  
  return { cards, loading, addCard, removeCard, calculateDiscount, updateFideliteAfterBooking, loadCards };
};