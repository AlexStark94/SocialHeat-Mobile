import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const points = [
    {latitude: 37.78832, longitude: -122.4327, weight: 1},
    {latitude: 37.78759, longitude: -122.4295, weight: 0.5},
    {latitude: 37.78535, longitude: -122.4446, weight: 0.2},
    {latitude: 37.78505, longitude: -122.4400, weight: 0.1},
    {latitude: 37.78450, longitude: -122.4350, weight: 0.05},
    {latitude: 37.78410, longitude: -122.4310, weight: 0.01},
    {latitude: 37.78410, longitude: -122.4120, weight: 0.01},
    {latitude: 37.78410, longitude: -122.4130, weight: 0.05},
    {latitude: 37.78010, longitude: -122.4330, weight: 0.05},
    {latitude: 37.77010, longitude: -122.4330, weight: 0.05},
    {latitude: 37.77000, longitude: -122.4320, weight: 0.01},
    {latitude: 37.74535, longitude: -122.3446, weight: 0.5},
    {latitude: 37.73535, longitude: -122.2446, weight: 0.01},
    {latitude: 37.63535, longitude: -122.1446, weight: 0.2},
    {latitude: 37.63535, longitude: -121.4446, weight: 0.9}
  ];
  
  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Heatmap
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            points={points}
            radius={40}
            gradient={{
              colors: ["yellow", "orange", "red", "purple"],
              startPoints: [0.01, 0.1, 0.65, 0.9],
              colorMapSize: 2000
            }}
          >

          </Heatmap>
        </MapView>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    flexGrow: 1,
  },
  map: {
    height: screenHeight,
    width: '100%',
  },
});
