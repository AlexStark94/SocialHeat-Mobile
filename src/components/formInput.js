import React from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
// import { TextInput } from 'react-native-paper';

export default function FormInput({ labelName, placeholder = "", icon = null, style = "", ...rest }) {
  return (
    <SafeAreaView style={{ width: '100%' }}>
      <View style={{...styles.container, ...style}}>
        {icon}
        <TextInput
          style={{...styles.input}}
          placeholder={placeholder}
          {...rest}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#EDEDED',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 16,
    marginBottom: 8
  },
  input: {
    flex: 1,
    paddingTop: 8,
    paddingRight: 10,
    paddingBottom: 8,
    paddingLeft: 0,
    color: '#424242',
    marginLeft: 16
  }
});
