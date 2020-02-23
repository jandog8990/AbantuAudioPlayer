import React from 'react';
import {Image} from 'react-native';

// Logo title for the top centered image
class LogoTitle extends React.Component {
    render() {
        return (
            <Image
                source={require('../../icons/abantu_logo_transparent.png')}
                style={{ width: 38, height: 38 }}
            />
        );
    }
}

export default LogoTitle;