import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Title } from 'react-native-paper';

import FormButton from '../components/formButton';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Title>SocialHeat</Title>
      <FormButton modeValue='contained' title='Logout' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
