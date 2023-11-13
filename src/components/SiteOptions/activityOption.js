import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';

const ActivityOption = ({ option, posts }) => {
  return (
    <View style={styles.optionContainer}>
      <Text style={styles.optionHeader}>{option}</Text>
      <ScrollView horizontal={true}>
        <View style={styles.postContainer}>
          {posts && posts?.map((post, index) => (
            <Image
              key={index}
              style={{
                width: 100,
                height: 100,
                margin: 8,
                borderRadius: 8,
              }}
              source={{ uri: post?.img }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    paddingTop: 18,
    border: '1px solid #EDEDED',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 20,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 24,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    marginHorizontal: -16,
    flex: 1,
    paddingBottom: 32
  },
  optionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#858585',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  postContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default ActivityOption;