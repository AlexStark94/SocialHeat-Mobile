import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import MapView, { Heatmap, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { db } from '../firebase';
import * as Location from 'expo-location';
import { View, Image } from 'react-native';

const screenHeight = Dimensions.get('window').height;

const customMapStyle = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off', // "off" hará que los POI sean invisibles
      },
    ],
  },
];

const CustomMarker = ({ coordinate, imageUri, navigation, point }) => (
  <Marker
    onPress={() => {
      navigation.navigate('Site', { ...point });
    }}
    coordinate={coordinate}
  >
    <View style={styles.customMarker}>
      <Image style={styles.markerImage} source={{ uri: imageUri }} />
    </View>
  </Marker>
);

export default function HomeScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [clients, setClients] = useState(null);
  const [points, setPoints] = useState([
    { latitude: 37.78832, longitude: -122.4327, weight: 1 }
  ]);

  useEffect(() => {
    const postsQuesty = query(
      collection(db, "images"),
      orderBy("createdAt", "asc"),
      limit(50)
    );

    const unsubscribePosts = onSnapshot(postsQuesty, (QuerySnapshot) => {
      const fetchedImages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedImages.push({ latitude: doc.data().location.lat, id: doc.id, longitude: doc.data().location.lng, weight: 0.01 });
      });
      const sortedImages = fetchedImages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setPoints(sortedImages);
    });

    return () => unsubscribePosts;
  }, [])

  useEffect(() => {
    const clientsQuesty = query(
      collection(db, "clients"),
      limit(50)
    );

    const unsubscribeClients = onSnapshot(clientsQuesty, (QuerySnapshot) => {
      const clients = [];
      QuerySnapshot.forEach((doc) => {
        clients.push({
          latitude: doc.data().location.lat,
          id: doc.id,
          longitude: doc.data().location.lng,
          img: doc.data().img,
          name: doc.data().name
        });
      });
      setClients(clients);
    });

    return () => unsubscribeClients;
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
            customMapStyle={customMapStyle}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onMarkerPress={e => console.log(e)}
          >
            {clients && clients.map((point) => (
              <CustomMarker
                key={point.id}
                coordinate={{ latitude: point.latitude, longitude: point.longitude }}
                imageUri={point.img}
                point={point}
                navigation={navigation}
              />
            ))}
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
  customMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFFAA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    marginTop: 0,
    flexGrow: 1,
  },
  map: {
    height: screenHeight,
    width: '100%',
  },
});
