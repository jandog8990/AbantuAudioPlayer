import React from 'react';
import {
    View,
    Text
} from 'react-native';

import { AudioStackProps } from '../interfaces/props/AudioStackProps';

export default class MainBook extends React.Component<AudioStackProps, any> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <View>
            <Text>This is a test Puto!</Text>
        </View>
        );
    }
}