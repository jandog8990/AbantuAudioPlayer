import React, { Component } from 'react';
import {
	View,
	Text,
	Image,	
	Platform,
	StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';

// Custom objects and models from other TypeScript files
import { AudioBookProps } from '../../interfaces/props/AudioBookProps';
import { StackNavProps } from '../../interfaces/props/StackNavProps';
import { ChapterInfo } from '../../enums/ChapterInfo';
import ChapterController from 'src/controllers/ChapterController';

// Combine audio book and navigation props
interface PlayerControllerProps extends AudioBookProps, StackNavProps {};

// Can merge different props files (i.e. extends)
// type PlayerControlsProps = PlayerProps & ThemeProps;

/**
 * Player controls view that controls the player playback from
 * multiple screens. This will be the minimized full player
 * located at the bottom of each screen.
 */

 /*
	const toggle = (paused) => {
		//this.props.player.toggle();
		console.log("The pause/play button on controls!");
		//this.props.playerControlContainer.setPaused(!paused)
	}
 */

// export default class PlayerControls extends Component<PlayerControllerProps> {
const PlayerControls = ({
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

export default PlayerControls;

const styles = StyleSheet.create({
	controls: {
		height: 60,
		width: '100%',
		flexDirection: "row",
		justifyContent: 'flex-start',
		paddingStart: 10,
		paddingEnd: 30,
		marginTop: 30,
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

