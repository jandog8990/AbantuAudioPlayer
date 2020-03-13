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

export default class FullPlayerNavigation {

    getNavigationOptions = (navigation) => {
        return {
            title: navigation.getParam('bookTitle', 'Full Player'),
            gesturesEnabled: true,	
            gestureDirection: 'vertical',	
            ...TransitionPresets.ModalSlideFromBottomIOS,
            headerBackTitleVisible: false,	
            headerTitleStyle: { color: 'black', fontSize: 14, width : Dimensions.get('window').width/1.6, textAlign: 'center'},	
            headerStyle: { backgroundColor: 'white' },
            headerTintColor: 'black',
            headerLeft: () =>
                <TouchableOpacity onPress={() => navigation.goBack()}>	
                <Icon 
                    containerStyle={{paddingLeft:20, paddingTop: 5}}
                    type="material"
                    color='black'	
                    size={30}
                    name="keyboard-arrow-down"	
                />	
                </TouchableOpacity>,
            headerRight: () =>
                <TouchableOpacity> 
                <Icon 
                    containerStyle={{paddingRight:20, paddingTop: 0}}
                    type="material"
                    color='black'	
                    size={30}
                    name="more-vert"	
                />
                </TouchableOpacity>,
        }
    }
}