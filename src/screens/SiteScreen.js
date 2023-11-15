import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from '../firebase';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import ActivityOption from '../components/SiteOptions/activityOption';

const SiteScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState(null);
  const [option, setOption] = useState('activity');

  useEffect(() => {
    const postsQuery = query(
      collection(db, 'clients', route?.params?.id, 'posts'),
      limit(50)
    );

    const unsubscribePosts = onSnapshot(postsQuery, (QuerySnapshot) => {
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
  }, [route?.params?.id]);

  console.log(route?.params?.id)

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{route?.params?.name}</Text>
      <Image
        style={{
          width: '100%',
          height: 150,
          marginTop: 14,
          borderRadius: 8,
        }}
        source={{ uri: route?.params?.img }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setOption('users')}>
          <MaterialCommunityIcons
            name={"account-group"}
            color={option === 'users' ? '#FF774B' : '#878787'}
            size={32}
          />
          <Text 
            style={{...styles.buttonText, color: option === 'users' ? '#FF774B' : '#878787'}}
          >
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setOption('activity')}>
          <MaterialCommunityIcons
            name={"apps"}
            color={option === 'activity' ? '#FF774B' : '#878787'}
            size={32}
          />
          <Text 
            style={{...styles.buttonText, color: option === 'activity' ? '#FF774B' : '#878787'}}
          >
            Activity
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setOption('menu')}>
          <MaterialCommunityIcons
            name={"text-box-outline"}
            color={option === 'menu' ? '#FF774B' : '#878787'}
            size={32}
          />
          <Text 
            style={{...styles.buttonText, color: option === 'menu' ? '#FF774B' : '#878787'}}
          >
            Menu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search', {...route?.params})}>
          <MaterialCommunityIcons
            name={"message-text"}
            color={option === 'chat' ? '#FF774B' : '#878787'}
            size={32}
          />
          <Text 
            style={{...styles.buttonText, color: option === 'chat' ? '#FF774B' : '#878787'}}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>

      {
        option === 'activity' &&
        <ActivityOption option={option} posts={posts} />
      }
    </View>
  );
};

export default SiteScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 32,
    flexGrow: 1,
  },
  header: {
    marginTop: 48,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6d6d6d',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: '22%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    border: '1px solid #EDEDED',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#878787',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600'
  },
});
