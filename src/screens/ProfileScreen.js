import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { getUserDocument } from '../firebase';
import { AuthContext } from '../context/authProvider';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 75,
  },
  text: {
    marginLeft: 16,
    fontSize: 22,
    color: '#6D6D6D',
    fontWeight: 'bold'
  },
});

const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState('');

  useEffect(() => {
    const fetchUserDocument = async () => {
      const userDocument = await getUserDocument(user.email);
      setUserData(userDocument);
    };

    fetchUserDocument();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          style={styles.image}
          source={{ uri: userData?.profileImg }}
        />
        <Text style={styles.text}>{userData?.name}</Text>
      </View>
    </View>
  );
};

export default ProfileScreen;