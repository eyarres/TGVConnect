import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const useNotifications = () => {
  const programmerRappel = async (titre, message, delaiEnSecondes = 15) => {
    
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('urgent', {
        name: 'Urgent',
        importance: Notifications.AndroidImportance.MAX, 
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#B0005E',
      });
    }

    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: titre,
        body: message,
        sound: 'default',
      },
      trigger: { 
        seconds: delaiEnSecondes,
        channelId: 'urgent', 
      },
    });

    Alert.alert("Rappel activé 🔔", "Verrouillez votre téléphone pour tester !");
  };

  return { programmerRappel };
};