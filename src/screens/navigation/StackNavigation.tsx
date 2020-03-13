import React from 'react';

// Component screen imports
import { Icon } from 'react-native-elements';
import { 
    Platform,
    Dimensions, 
    TouchableOpacity
} from 'react-native';
import LogoTitle from '../LogoTitle';
import { TransitionPresets } from 'react-navigation-stack';

export default class StackNavigation {
    getNavigationOptions = (navigation) => {
        return {
            gesturesEnabled: true,	
            headerBackTitleVisible: false,	 
            headerTitleStyle: { color: 'black', fontSize: 14, width : Dimensions.get('window').width/1.6, textAlign: 'center'},	
            headerStyle: { backgroundColor: 'white' },
            headerTintColor: 'black',
        } 
    }
}