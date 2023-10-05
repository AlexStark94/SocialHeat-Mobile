import { NavigationContainer } from '@react-navigation/native';
import React, { useContext, useState, useEffect } from 'react';

import Loading from '../components/loading';

import AuthStack from './authStack';
import HomeStack from './homeStack';
import { AuthContext } from './authProvider';

export default function Routes() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    console.log(user)
  }, [initializing, setUser, user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
}