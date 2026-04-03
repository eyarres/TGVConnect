import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/client/SearchScreen';
import ResultsScreen from '../screens/client/ResultsScreen';
import ReservationScreen from '../screens/client/ReservationScreen';
import PassengerScreen from '../screens/client/PassengerScreen';

const Stack = createNativeStackNavigator();

export default function SearchNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="Reservation" component={ReservationScreen} />
      <Stack.Screen name="Passenger" component={PassengerScreen} />
    </Stack.Navigator>
  );
}