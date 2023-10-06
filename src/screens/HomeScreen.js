import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import MapView, { Heatmap, PROVIDER_GOOGLE } from 'react-native-maps';
import { db } from '../firebase';
import * as Location from 'expo-location';

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [points, setPoints] = useState([
    { latitude: 37.78832, longitude: -122.4327, weight: 1 }
  ]);

  useEffect(() => {
    const q = query(
      collection(db, "images"),
      orderBy("createdAt", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedImages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedImages.push({ latitude: doc.data().location.lat, id: doc.id, longitude: doc.data().location.lng, weight: 0.01 });
      });
      const sortedImages = fetchedImages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setPoints(sortedImages);
    });
    return () => unsubscribe;
  }, [])

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Not granted permission');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.container}>
        {
          location?.coords &&
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Heatmap
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
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
        }
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
