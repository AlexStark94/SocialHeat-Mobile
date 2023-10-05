import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Title } from 'react-native-paper';

import FormButton from '../components/formButton.js';
import FormInput from '../components/formInput.js';
import { AuthContext } from '../context/authProvider.js';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { IMAGENAME } from '../../assets/socialheat-logo-transparent.png';

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
      <Image
        style={{
          height: 150,
          width: 150
        }}
        source={require('../../assets/socialheat-logo-transparent.png')}
      />
      <Title style={styles.titleText}>SocialHeat</Title>

      <View style={styles.buttonsContainer}>
        <FormInput
          labelName='Email'
          value={email}
          placeholder='Your email'
          icon={
            <MaterialCommunityIcons
              name={'account-outline'}
              color={'#26262688'}
              size={16}
            />
          }
          autoCapitalize='none'
          onChangeText={(userEmail) => setEmail(userEmail)}
        />
        <FormInput
          labelName='Password'
          value={password}
          secureTextEntry={true}
          placeholder='Your password'
          icon={
            <MaterialCommunityIcons
              name={'lock-outline'}
              color={'#26262688'}
              size={16}
            />
          }
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
        <View
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 46
          }}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text
            style={styles.donHaveAccountText}
          >
            Don’t have an account?
          </Text>
          <Text
            style={styles.registerText}
          >
            Register
          </Text>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'col'
  },
  titleText: {
    fontSize: 52,
    fontWeight: 'bold',
    paddingTop: 24,
    marginBottom: 64
  },
  loginButtonLabel: {
    fontWeight: 'bold'
  },
  donHaveAccountText: {
    fontSize: 12,
    color: 'white'
  },
  registerText: {
    fontSize: 12,
    color: '#FF7A00',
    fontWeight: 'bold',
    marginLeft: 4
  },
  buttonsContainer: {
    paddingVertical: 40,
    paddingHorizontal: 32,
    width: '100%',
    backgroundColor: '#00000033',
    borderRadius: 15
  }
});