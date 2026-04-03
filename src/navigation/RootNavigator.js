import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ClientNavigator from './ClientNavigator';
import ControllerScreen from '../screens/controller/ControllerScreen';

export default function RootNavigator() {
  const { user } = useContext(AuthContext);

  if (user && user.role === 'controleur') {
    return <ControllerScreen />;
  }

  return <ClientNavigator />;
}