import React from 'react';
import { 
	TouchableOpacity,	
	StyleSheet,	
	SafeAreaView,	
	Button, 
	Platform, 
	Image, 
	View, 
	Text,
	Animated,
	Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import styled from "styled-components";

// Screen height for the current app
const screenHeight = Dimensions.get("window").height;

/**
 * Chapter list modal screen accessed by the main book player
 * page, this page can also be used in other playlists
 */
// <style={styles.navBarLeftButton} onPress={() => this.props.navigation.goBack()}></style>
export default class ChapterListModal extends React.Component {
	state = {
		top: new Animated.Value(screenHeight)
	}

	componentDidMount() {
        this.toggleModal()
    }

	toggleModal = () => {
		Animated.spring(this.state.top, {
			toValue: 150
		}).start()
	}

	closeModal = () => {
		Animated.spring(this.state.top, {
			toValue: screenHeight
		}).start()
	}

	/*

	<Text style={styles.header}>Chapters</Text>
	*/
	render() {
		return (
		<AnimatedContainer style={{top: this.state.top}}>
			<TouchableOpacity
				onPress={this.closeModal}
				style={{ position: "absolute", top: -20, left: "50%", marginLeft: -22, zIndex: 1 }}
			>
				<CloseView style={{ elevation: 10 }}>
				<Icon
					size={44}	
					type="ionicon"
					name={Platform.OS === "ios" ? "ios-close" : "md-close"}
					color='purple'
				/>
				</CloseView>
			</TouchableOpacity>	
		</AnimatedContainer>
		);	
	}
}

// Create the styled view for the AnimatedContainer
const Container = styled.View`
	position: absolute;
	background: white;
	width: 100%;
	height: 100%;
	z-index: 100;
`

// Create the close view to remove the chapter list
const CloseView = styled.View`
	width: 44px;
	height: 44px;
	border-radius: 22px;
	background: white;
	justify-content: center;
	align-items: center;
	box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);
`

const AnimatedContainer = Animated.createAnimatedComponent(Container);


const styles = StyleSheet.create({
	container: {
		position: "absolute",
		paddingTop: 20,
		height: '100%',
		width: '100%',
		backgroundColor: Colors.lighter,
		zIndex: 100
	},
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
