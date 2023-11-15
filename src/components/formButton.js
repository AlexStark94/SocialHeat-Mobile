import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

export default function FormButton({ title, modeValue, style = "", ...rest }) {
  return (
    <Button
      mode={modeValue}
      style={{...styles.button, ...style}}
      {...rest}
    >
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    backgroundColor: '#EF5C2E',
    width: '100%',
    borderRadius: 50
  },
});
