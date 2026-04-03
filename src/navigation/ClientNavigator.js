import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Search, Ticket, CreditCard, Map, CircleHelp } from 'lucide-react-native';

import SearchNavigator from './SearchNavigator';
import CardsScreen from '../screens/client/CardsScreen';
import MapScreen from '../screens/client/MapScreen';
import AccountScreen from '../screens/client/AccountScreen';
import MyTicketsScreen from '../screens/client/MyTicketsScreen'; 

const Tab = createBottomTabNavigator();

export default function ClientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Recherche') return <Search color={color} size={size} />;
          if (route.name === 'Mes Billets') return <Ticket color={color} size={size} />;
          if (route.name === 'Cartes') return <CreditCard color={color} size={size} />;
          if (route.name === 'Gares') return <Map color={color} size={size} />;
          if (route.name === 'Compte') return <CircleHelp color={color} size={size} />;
        },
        tabBarActiveTintColor: '#B0005E',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Recherche" component={SearchNavigator} />
      
      <Tab.Screen name="Mes Billets" component={MyTicketsScreen} />
      
      <Tab.Screen name="Cartes" component={CardsScreen} />
      <Tab.Screen name="Gares" component={MapScreen} />
      <Tab.Screen name="Compte" component={AccountScreen} />
    </Tab.Navigator>
  );
}