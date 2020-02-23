import React from 'react';
import {
    View,
    Text
} from 'react-native';

// Timer is a converter from minutes to seconds for players and controllers
const Timer = (currentTime) => (
    <View style={{alignItems: 'center'}}>
        <Text>{Math.floor(currentTime/60)} : {Math.floor(currentTime%60)}</Text>
    </View>
);
export default Timer;