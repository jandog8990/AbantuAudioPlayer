import React from 'react';

// Component screen imports
import { Icon } from 'react-native-elements';
import { 
    Platform,
} from 'react-native';
import LogoTitle from '../LogoTitle';

export default class HomeNavigation {
    
    getNavigationOptions = () => {
        return {
            headerTitle: () => <LogoTitle/>,
            gesturesEnabled: false,	
            headerBackTitleVisible: false,	
            headerLeft: () =>
                <Icon
                    containerStyle={{paddingLeft:20, paddingTop: 5}}
                    type="ionicon"
                    name={Platform.OS === "ios" ? "ios-contact" : "md-contact"}
                />,
            headerRight: () =>
                <Icon
                    containerStyle={{paddingRight:20, paddingTop: 5}}
                    type="ionicon"
                    name={Platform.OS === "ios" ? "ios-search" : "md-search"}
                />	
        } 
    } 
}	