/**
 * React Native main player for the react native video streaming service
 */

import React, { Component } from 'react';
import axios from 'react-native-axios';
import {
  View,
  Text,
  Image, 
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import Header from './Header';
import AlbumArt from './AlbumArt';
import ChapterDetails from './ChapterDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';
import Video from 'react-native-video';

import PlayerController from '../../controllers/PlayerController';

// Import the API configuration for hitting certain endpoints
import { apiConfig } from '../../config/config';
import { AudioBookResponse } from 'src/interfaces/network/AudioBookResponse';
import { Chapter } from 'src/interfaces/models/Chapter';
import { ChapterInfo } from '../../enums/ChapterInfo';

import PlayerControlContainer from '../../containers/PlayerControlContainer';
import { NavigationActions } from 'react-navigation';
import { Subscribe } from 'unstated';

export default class FullPlayer extends PlayerController {

	// Initilize the audio player
	audioPlayer;
	navigation;
	AUDIO; IMAGE; TITLE;
	constructor(props) {
		super(props);

		// TODO Think of how we will pass the audio player across multiple classes
		// and also how to share code from the PlayerController
		this.navigation = this.props.navigation;
		this.AUDIO = ChapterInfo.AUDIO;
		this.IMAGE = ChapterInfo.IMAGE;
		this.TITLE = ChapterInfo.TITLE;

		// Create bindings for the functions used in player
		this.setCurrentTime = this.setCurrentTime.bind(this);
		this.setDuration = this.setDuration.bind(this);
		this.onSeek = this.onSeek.bind(this); 
		this.onBack = this.onBack.bind(this); 
		this.onForward = this.onForward.bind(this); 

		// TODO May want to remove this
		this.state = {
			rerender: false
		};
	}

	// Audio URL
	audioUrl: string = apiConfig.baseUrl + apiConfig.bookPlayer + apiConfig.isbn + "/" + apiConfig.titleId + "/" + apiConfig.orderId;

	// Component mounted => query the database for the audiobook
	// TODO: The url and book info should be retrieved from the navigation props from previous page
	componentDidMount() {

		// Initialize the MusicControl service (embedded player)
		this.initializeMusicControl();

		// Initialize the action controls
		this.initializeActionControl();

		// Build the URL based on the ISBN, SEARCH_ID and ORDER_ID from the Book object
		this.fetchJSONAsync(this.audioUrl);
	}

	// Check that the chapter list and elements exist
	checkChapterList = (chapterList: Chapter[], chapterIndex: number):boolean => {
		return (chapterList.length != 0) && (chapterList[chapterIndex] != undefined);
	}

	// Load the chpater info using the specified ChapterInfo enum and chapter list crap
	loadChapter = (chapterInfo: ChapterInfo, chapterList: Chapter[], chapterIndex: number) => {
		let dataString = "";
		if (this.checkChapterList(chapterList, chapterIndex)) {
			switch (chapterInfo) {
				case (this.AUDIO): {
					dataString = chapterList[chapterIndex].AUDIO_LOC ? chapterList[chapterIndex].AUDIO_LOC : "";
					break;
				}
				case (this.IMAGE): {
					dataString = chapterList[chapterIndex].PHOTO_LOC ? chapterList[chapterIndex].PHOTO_LOC : "";
					break;
				}
				case (this.TITLE): {
					dataString = chapterList[chapterIndex].TITLE ? chapterList[chapterIndex].TITLE : "";
					break;
				}
			}
		}
		return dataString;
	}

	// Fetch the purhchased book using the url provided in the Library component
	fetchJSONAsync = async(audiobookUrl) => {
		try {
			const response: AudioBookResponse = await axios.get(audiobookUrl);
			console.log("Axis Response:");
			console.log(response.data);
			console.log("\n");
		
			// Create 
			const audioBook = response.data.book;
			const chapterList = response.data.chapterList;	
			const numChapters = chapterList.length; 
			console.log("Number of chapters = " + numChapters);

			// Append the spaces with %20 fill in for audio files to run
			for (var i = 0; i < numChapters; i++) {
				var audio = chapterList[i].AUDIO_LOC;
				var encode = audio.replace(/ /g, "%20");
				chapterList[i].AUDIO_LOC = encode;
			}

			// Audiobook needs to be filtered out into Book and Chapter[]
			this.props.playerControlContainer.foundChapters(audioBook, chapterList);
		} catch(err) {
			console.error(err);
		}
	}

	// Forward disabled if the index equals the number of chapters (end of book)
	onForwardDisabled = (data) => {
		// does this return a boolean to disable the FWD button?
		const { chapterIndex, chapterList } = this.props.playerControlContainer.state;
		return chapterIndex === chapterList.length - 1;
	}

	// Play method for playing the chapters
	onPlay = (data) => {
		console.log("On Press Play(data)!");
		console.log("data duration = " + data.duration);
		console.log("\n");

		this.playCurrentChapter();
	}

	// Tracks the progress of the player
	onProgress = (data) => {
		const { isLoading } = this.props.playerControlContainer.state;

		if (!isLoading) {
			// this.setState({currentTime: data.currentTime});

			// This updates the time in the master player controls container
			this.updatePlayTime(data.currentTime);
		}
	}

	// End method for for the player ending
	onEnd = () => {
		this.props.playerControlContainer.setBookEnded(true);
	}

	// Handle error from the video
	onError = (error) => console.log("Audio player error occurred: " + error);

	// On seek method for ffw and rwd
	onSeek = (time) => {
		time = Math.round(time);

		// this.audioPlayer && this.audioPlayer.seek(time);
		this.audioPlayer.seek(time);

		// this.setState({ currentPosition: time, paused: false });

		// Set the current position
		this.props.playerControlContainer.setCurrentPosition(time);

		// Set the paused to false (play)
		this.props.playerControlContainer.setPaused(false);
	}

	// On pause from the pause button and also the slider
	onPause = () => {

		// this.setState({ paused: true });
		this.props.playerControlContainer.setPaused(true);
	}

	onBack = () => {

		// Always seek to the beginning of the audio player then go to previous chapter
		this.audioPlayer && this.audioPlayer.seek(0);

		// Play the previous chapter using PlayerController
		this.playPreviousChapter();
	}

	onForward = () => {

		// Seek to the beginning of the AudioPlayer
		this.audioPlayer && this.audioPlayer.seek(0);

		// Play the next chapter using PlayerController
		this.playNextChapter();
	}

	/**
	 * Update methods for updating the current state of the player
	 */

	// Upade the chapter duration with the current chapter
	setDuration = (data) => {

		// this.setState({chapterDuration: Math.floor(data.duration)});
		this.props.playerControlContainer.setTotalLength(Math.floor(data.duration));
	}

	// Set the current position of the chapter using current time
	setCurrentTime = (data) => {

		// this.setState({currentPosition: Math.floor(data.currentTime)});
		this.props.playerControlContainer.setCurrentPosition(Math.floor(data.currentTime));

		// Update the play time for the MusicControl
		this.updatePlayTime(data.currentTime);
	}
		
	/*
	* Play the audio in the background requires:
	* 		playInBackground=true	
	*		ignoreSilentSwitch="ignore"	
	*/

  	render() {

		console.log("Render FULL PLAYER!");

		return (
		<Subscribe to={[PlayerControlContainer]}>
		{(
			{state: {isLoading, chapterList, rate, 
				currentPosition, chapterDuration, paused, chapterIndex}}
		) => (
			<SafeAreaView style={styles.container}>
				<Video
					source={{uri: this.loadChapter(this.AUDIO, chapterList, chapterIndex), type: "m3u8"}} // Can be a URL or a local file.
					ref={audioPlayer => (this.audioPlayer = audioPlayer)}
					playInBackground={true}	
					playWhenInactive={true}	
					ignoreSilentSwitch="ignore"
					style={styles.audioElement}
					paused={paused}
					onLoad={this.setDuration} // Callback when video loads
					onProgress={this.setCurrentTime} // Callback every ~250ms with current position using time
					onEnd={this.onEnd} 
					resizeMode="cover"
					rate={rate}
					onError={this.onError} // Callback when video cannot be loaded
					fullscreen={false}
				/>
				<StatusBar hidden={true} />
				<AlbumArt url={this.loadChapter(this.IMAGE, chapterList, chapterIndex)} />
				<ChapterDetails title={this.loadChapter(this.TITLE, chapterList, chapterIndex)} /> 
				<SeekBar
					chapterDuration={chapterDuration}
					currentPosition={currentPosition}
					onSeek={this.onSeek}
					onSlidingStart={this.onPause} />
				<Controls
					forwardDisabled={this.onForwardDisabled}
					onPressPlay={this.onPlay} 
					onPressPause={this.onPause}
					onBack={this.onBack}
					onForward={this.onForward}
					paused={paused}/>
				<View>
				<TouchableOpacity> 
					<View style={styles.chapterButton}> 
					<Image source={require('../../../img/2x/baseline_format_list_bulleted_black_36dp.png')} style={styles.buttons} />
					<Text style={styles.chapters}>Chapters</Text>	
					</View>
				</TouchableOpacity>
				</View>
			</SafeAreaView>
		)}
		</Subscribe>
		);
	}
}

   // tintColor: 'black',
const styles = StyleSheet.create({
  container: {
    flex: 1,
	backgroundColor: 'white',
  },
  chapters: {
    fontSize: 12,
    color: 'rgb(64,64,64)',
    textAlign: 'center',
  },
  buttons: {
 	width: 35,
 	height: 35,
    tintColor: 'purple'
  },
  chapterButton: {
    paddingTop: 30,	
	alignItems: 'center',
	justifyContent: 'center',
  },
  audioElement: {
    height: 0,
    width: 0,
  }
});
