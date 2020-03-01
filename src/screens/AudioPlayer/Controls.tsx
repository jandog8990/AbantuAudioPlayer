/**
 * Player controls for the previous, next, play/pause
 * shuffle and repeat buttons
 */

import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';

/**
 * Controls for user actions (i.e. pause, play) for the main FullPlayer
 * @param
 */
// TODO: Look for ways of disabling the forward button
const Controls = ({
  forwardDisabled,
  onPressPlay,
  onPressPause,
  onBack,
  onForward,
  paused,
}) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onBack}> 
   	  <Icon 
		    color="purple"	
		    type="material"
        size={38}
        name="skip-previous" />
	  </TouchableOpacity>
    <View style={{width: 20}} />
    <TouchableOpacity onPress={onBack}>
      <Icon 
        color="purple"	
        type="material"
        size={44}
        name="replay-30" />
    </TouchableOpacity>
    <View style={{width: 20}} />
    {!paused ?
      <TouchableOpacity onPress={onPressPause}>
        <View style={styles.playButton}>
          <Image source={require('../../../img/ic_pause_white_48pt.png')} style={styles.buttons} />
        </View>
      </TouchableOpacity> :
      <TouchableOpacity onPress={onPressPlay}>
        <View style={styles.playButton}>
          <Image source={require('../../../img/ic_play_arrow_white_48pt.png')} style={styles.buttons} />
        </View>
      </TouchableOpacity>
    }
    <View style={{width: 20}} />
    <TouchableOpacity onPress={onForward}>
   	  <Icon 
        color="purple"	
        type="material"
        size={44}
        name="forward-30" />
    </TouchableOpacity>
    <View style={{width: 20}} />
    <TouchableOpacity onPress={onForward}>
   	  <Icon 
        color="purple"	
        type="material"
        size={38}
        name="skip-next" />
    </TouchableOpacity>
  </View>
);

export default Controls;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  playButton: {
    height: 70,
    width: 70,
    borderWidth: 1,
    borderColor: 'purple',
	borderRadius: 72 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
	tintColor: 'purple'
  },
  secondaryControl: {
    height: 18,
    width: 18,
  },
  off: {
    opacity: 0.30,
  }
})
