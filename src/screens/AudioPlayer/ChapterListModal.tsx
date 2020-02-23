import React from 'react';
import { 
	TouchableOpacity,	
	StyleSheet,	
	SafeAreaView,	
	Button, 
	Platform, 
	Image, 
	View, 
	Text 
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';

/**
 * Chapter list modal screen accessed by the main book player
 * page, this page can also be used in other playlists
 */
export default class ChapterListModal extends React.Component {
	render() {
		return (	
		<SafeAreaView style={{ paddingTop: 50, backgroundColor: Colors.lighter}}>
			<TouchableOpacity style={styles.navBarLeftButton} onPress={() => this.props.navigation.goBack()}>
			<Icon
				containerStyle={{marginLeft:20}}
				size={50}	
				type="ionicon"
				name={Platform.OS === "ios" ? "ios-close" : "md-close"}
			/>	
			<Text style={styles.header}>Chapters</Text>
			<Icon
				containerStyle={{marginRight:20}}
				size={50}	
				color={Colors.lighter}	
				type="ionicon"
				name={Platform.OS === "ios" ? "ios-close" : "md-close"}
			/>	
			</TouchableOpacity>	
		</SafeAreaView>
		);	
	}
}

const styles = StyleSheet.create({
	navBarLeftButton: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	header: {
		fontSize: 20, 
		textAlign: 'center',
		flex: 2
	}
});
