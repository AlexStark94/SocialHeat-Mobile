import React from 'react';
import { StyleSheet } from 'react-native';

import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.container}>
        
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    marginTop: 16,
    flex: 1,
  },
});
