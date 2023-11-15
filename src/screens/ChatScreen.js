import React, { useContext, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, Keyboard, Image } from 'react-native';
import { Text } from 'react-native-paper';

import FormButton from '../components/formButton';
import { AuthContext } from '../context/authProvider';

import { collection, addDoc, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import { db, getUserDocument } from '../firebase';
import FormInput from '../components/formInput';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ChatScreen({ route, navigation }) {
  const { logout, user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState('');

  const screenHeight = Dimensions.get('window').height;
  const chatContainerHeight = screenHeight - 230;

  const scrollViewRef = useRef();

  const sendMessage = async () => {
    try {
      setMessage('');
      const docRef = await addDoc(collection(db, 'clients', route?.params?.id, 'chatMessages'), {
        message: message,
        from: user.displayName,
        timestamp: new Date()
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  useEffect(() => {
    const fetchUserDocument = async () => {
      const userDocument = await getUserDocument(user.email);
      setUserData(userDocument);
    };

    fetchUserDocument();
  }, [route?.params?.id]);

  useEffect(() => {
    const q = query(
      collection(db, 'clients', route?.params?.id, 'chatMessages'),
      orderBy("timestamp", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.timestamp - b.timestamp
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe;
  }, [route?.params?.id])


  useEffect(() => {
    if (scrollViewRef?.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [setMessages, messages])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: route?.params?.img }}
            />
          </View>

          <View>
            <Text style={styles.text}>{route?.params?.name}</Text>
            <Text style={styles.subText} onPress={() => navigation.navigate("Site", { ...route?.params })}>View profile</Text>
          </View>
        </View>

        <ScrollView ref={scrollViewRef} style={[styles.chatbox, { height: chatContainerHeight }]}>
          <View style={{ paddingBottom: 24 }}>
            {
              messages.map((msg, index) => (
                <View key={index} style={msg.from === user.displayName ? styles.containerEnd : styles.containerStart}>
                  <View style={msg.from === user.displayName ? styles.messageBox : styles.outMessageBox}>
                    <Text style={msg.from === user.displayName ? styles.textMessageBox : styles.textOutMessageBox}>{msg.message}</Text>
                  </View>
                  <Text style={styles.fromText}>{msg.from}</Text>
                </View>
              ))
            }
          </View>
        </ScrollView>

        <FormInput
          labelName='Enter a new message'
          style={{
            padding: 0,
            marginBottom: 0,
            justifyContent: 'end',
          }}
          value={message}
          icon={
            <View
              style={{
                top: -8,
                position: 'absolute',
                right: 4,
                zIndex: 10
              }}
            >
              <FormButton
                onPress={() => sendMessage()}
                modeValue='contained'
                title={
                  <MaterialCommunityIcons
                    name={'send'}
                    color={'#FDFDFD'}
                    size={16}
                  />
                }
              />
            </View>
          }
          autoCapitalize='none'
          onChangeText={(userMessage) => setMessage(userMessage)}
          onSubmitEditing={() => {
            sendMessage();
            Keyboard.dismiss();
          }}
        />

      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  containerEnd: {
    alignSelf: 'flex-end',
  },
  containerStart: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start'
  },
  chatbox: {
    backgroundColor: '#FAFAFA',
    display: 'flex',
    overflow: 'scroll',
    padding: 16,
    marginVertical: 8,
    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderRadius: 8,
  },
  outMessageBox: {
    padding: 8,
    backgroundColor: '#EF5C2E',
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'flex-start',
  },
  textOutMessageBox: {
    color: 'white',
    fontSize: 14
  },
  messageBox: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E9EB',
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'flex-start',
  },
  textMessageBox: {
    color: '#585858',
    fontSize: 14
  },
  fromText: {
    color: '#8A9099',
    fontSize: 10,
    textAlign: 'right'
  },
  contentContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    marginTop: 16,
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #EDEDED',
    borderRadius: 25,
    padding: 1,
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginLeft: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '400',
  },
  subText: {
    marginLeft: 8,
    fontSize: 11,
    color: '#FF774B',
    fontWeight: '400'
  }
});