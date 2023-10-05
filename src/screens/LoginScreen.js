import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Title } from 'react-native-paper';

import { signInWithEmailAndPassword } from 'firebase/auth';

import FormButton from '../components/formButton.js';
import FormInput from '../components/formInput.js';
import { auth } from '../firebase/index.js';
import { AuthContext } from '../context/authProvider.js';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    login(email, password)
      .then(() => console.log('asdasd'))
      .catch(error => alert(error.message));
  }

  return (
    <View style={styles.container}>
      <Title style={styles.titleText}>Welcome!</Title>
      <FormInput
        labelName='Email'
        value={email}
        autoCapitalize='none'
        onChangeText={(userEmail) => setEmail(userEmail)}
      />
      <FormInput
        labelName='Password'
        value={password}
        secureTextEntry={true}
        onChangeText={(userPassword) => setPassword(userPassword)}
      />
      <FormButton
        title='Login'
        modeValue='contained'
        labelStyle={styles.loginButtonLabel}
        onPress={() => {
          handleLogin()
        }}
      />
      <FormButton
        title='Sign up here'
        modeValue='text'
        uppercase={false}
        labelStyle={styles.navButtonText}
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10
  },
  loginButtonLabel: {
    fontSize: 22
  },
  navButtonText: {
    fontSize: 16
  }
});