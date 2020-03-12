import React, { Component } from 'react';
import {
	View,
	Text,
	Image,	
	Platform,
	StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';

// export default class PlayerControls extends Component<PlayerControllerProps> {
const MiniPlayer = ({
	title,
	author,
	image,	
	onPressPlay,
	onPressPause,
	paused
}) => (
	<View style={styles.controls}>
		<Image style={styles.cover} source={{uri: image}} /> 
		<View style={styles.title}>
			<Text style={styles.chapterTitle}>{title}</Text>
			<Text style={styles.chapterAuthor}>{author}</Text>
		</View>
		<View style={styles.icon}>
		{ !paused ?
			<Icon
				name={Platform.OS === "ios" ? "ios-pause" : "md-pause"}
				type="ionicon"	
				onPress={onPressPause}
			/> :
			<Icon
				name={Platform.OS === "ios" ? "ios-play" : "md-play"}
				type="ionicon"	
				onPress={onPressPlay}
			/>
		}	
		</View>
	</View>
);

export default MiniPlayer;

const styles = StyleSheet.create({
	controls: {
		height: 60,
		width: '100%',
		flexDirection: "row",
		justifyContent: 'flex-start',
		paddingStart: 10,
		paddingEnd: 30,
		backgroundColor: '#F8F8F8',
		// marginTop: 30,
		// marginTop: 20
		alignItems: 'center',
		borderTopColor: 'grey',
		borderBottomColor: 'grey',
		borderWidth: 0.5,
	},
	title: {
		flex: 1
	},
	chapterTitle: {
		color: 'black',
		fontSize: 16,
		fontWeight: 'bold',
		// textAlign: 'center'
	},
	chapterAuthor: {
		color: 'dimgrey',
		fontSize: 14,
		marginTop: 1,
	},	
	cover: {
		height: 50,
		width: 50,
		marginEnd: 10
	},
	icon: {
		paddingStart: 10
	}
});

