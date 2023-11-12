import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';

const SiteScreen = ({ route }) => {
  const [posts, setPosts] = useState(null);
  console.log(route?.params)

  useEffect(() => {
    const postsQuesty = query(
      collection(db, "clients", route?.params?.id, "posts"),
      limit(50)
    );

    const unsubscribePosts = onSnapshot(postsQuesty, (QuerySnapshot) => {
      const fetchedImages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedImages.push({ ...doc.data() });
      });
      const sortedImages = fetchedImages.sort(
        (a, b) => a.timestamp - b.timestamp
      );
      setPosts(sortedImages);
    });

    return () => unsubscribePosts;
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{route?.params?.name}</Text>
      <Image 
        style={{
          width: '100%',
          height: 150,
          marginTop: 14,
          borderRadius: 8
        }}
        source={{ uri: route?.params?.img }}
      />
    </View>
  );
};

export default SiteScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    marginTop: 32,
    flexGrow: 1,
  },
  header: {
    marginTop: 48,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6d6d6d',
    textAlign: 'center'
  }
});
