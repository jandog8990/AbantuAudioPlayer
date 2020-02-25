/**
 * Track details for the current audio file, author, narrator, etc.
 * This also includes a settings button and an add button for 
 * adding to playlist or to the cart
 */

import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

/**
 * ChapterDetails element that lists the title of the chapter in FullPlayer
 * @param 
 */
const ChapterDetails = ({
  title,
}) => (
  <View style={styles.container}>
    <View style={styles.detailsWrapper}>
      <Text style={styles.title}>{title}</Text>
    </View>
  </View>
);

export default ChapterDetails;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flexDirection: 'row',
    paddingLeft: 20,
    alignItems: 'center',
    paddingRight: 20,
  },
  buttons: {
    tintColor: 'black' 
  },
  detailsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  artist: {
    color: 'black', 
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    opacity: 0.72,
  },
  moreButton: {
    borderColor: 'black', 
    borderWidth: 2,
    opacity: 0.72,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonIcon: {
    height: 17,
    width: 17,
  }
});
