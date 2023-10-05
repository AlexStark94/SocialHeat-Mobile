import React, { useContext, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';

import FormButton from '../components/formButton';
import { AuthContext } from '../context/authProvider';

import { collection, addDoc, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import FormInput from '../components/formInput';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';

export default function ChatScreen() {
  const { logout, user } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const screenHeight = Dimensions.get('window').height;
  const chatContainerHeight = screenHeight - 320;

  const scrollViewRef = useRef();

  const sendMessage = async () => {
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        message: message,
        from: user.displayName,
        date: new Date()
      });
      console.log("Document written with ID: ", docRef.id);
      setMessage('')
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  const handleLogout = () => {
    logout()
      .then(() => console.log('asdasd'))
      .catch(error => alert(error.message));
  }

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("date", "asc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.date - b.date
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe;
  }, [])

  
  useEffect(() => {
    if (scrollViewRef?.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [setMessages, messages])

  return (
    <GestureHandlerRootView>
      <ScrollView style={styles.container}>
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
          value={message}
          autoCapitalize='none'
          onChangeText={(userMessage) => setMessage(userMessage)}
        />
        <FormButton
          onPress={() => sendMessage()}
          modeValue='contained'
          title='Send message'
        />

        <FormButton
          onPress={() => handleLogout()}
          modeValue='contained'
          title='Logout'
        />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    marginTop: 16,
    flexGrow: 1,
  },
  containerEnd: {
    alignSelf: 'flex-end',
  },
  containerStart: {
    alignSelf: 'flex-start',
  },
  chatbox: {
    backgroundColor: '#FAFAFA',
    display: 'flex',
    overflow: 'scroll',
    padding: 16,
    marginVertical: 32,
    borderColor: '#EBEBEB',
    borderWidth: 1,
    borderRadius: 8,
  },
  outMessageBox: {
    padding: 8,
    backgroundColor: '#EF5C2E',
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'flex-end',
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
  }
});
