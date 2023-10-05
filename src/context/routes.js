import { NavigationContainer } from '@react-navigation/native';
import React, { useContext } from 'react';

import AuthStack from './authStack';
import HomeStack from './homeStack';
import { AuthContext } from './authProvider';

export default function Routes() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}