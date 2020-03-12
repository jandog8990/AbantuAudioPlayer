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
  SafeAreaView,
  StyleSheet
} from 'react-native';
import Video from 'react-native-video';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import AlbumArt from './AlbumArt';
import ChapterDetails from './ChapterDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';
import AudioPlayer from './AudioPlayer';

import PlayerController from '../../controllers/PlayerController';
import ChapterController from '../../controllers/ChapterController';

// Import the API configuration for hitting certain endpoints
import { apiConfig } from '../../config/config';
import { AudioBookResponse } from 'src/interfaces/network/AudioBookResponse';
import { ChapterInfo } from '../../enums/ChapterInfo';

import PlayerControlContainer from '../../containers/PlayerControlContainer';
import { NavigationActions } from 'react-navigation';
import { Subscribe } from 'unstated';
import LibraryContainer from 'src/containers/LibraryContainer';

export default class FullPlayer extends PlayerController {

	// Initilize the audio player
	chapterController: ChapterController;
	audioPlayer;
	AUDIO; IMAGE; TITLE; AUTHOR;
	constructor(props) {
		super(props);

		// Initialize enums for the chapter controller
		this.AUDIO = ChapterInfo.AUDIO;
		this.IMAGE = ChapterInfo.IMAGE;
		this.TITLE = ChapterInfo.TITLE;
		this.AUTHOR = ChapterInfo.AUTHOR;

		// Create bindings for the functions used in player
		this.setCurrentTime = this.setCurrentTime.bind(this);
		this.setDuration = this.setDuration.bind(this);
		this.onSeek = this.onSeek.bind(this); 
		this.onBack = this.onBack.bind(this); 
		this.onForward = this.onForward.bind(this);

		// Global chapter controller object for chapter info
		this.chapterController = new ChapterController();
	}

	// Audio URL (TODO: This will be replaced by a full API on our React Native side)
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
			await this.props.playerControlContainer.foundChapters(audioBook, chapterList);

			// Load the book container books for viewing in the chapter list
			console.log("Fetch JSon DONE => setSelected()!");	
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

	// Tracks the progress of the player
	onProgress = (data) => {
		const { isLoading } = this.props.playerControlContainer.state;

		if (!isLoading) {
			// This updates the time in the master player controls container
			this.updatePlayTime(data.currentTime);
		}
	}

	// Handle error from the video
	onError = (error) => {
		console.log("Audio player error occurred: ");
		console.error(error);
		console.log("\n");
	}

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

	onBack = () => {

		// Play the previous chapter using PlayerController
		this.playPreviousChapter();

		// Always seek to the beginning of the audio player then go to previous chapter
		// this.audioPlayer && this.audioPlayer.seek(0);
	}

	onForward = () => {

		// Play the next chapter using PlayerController
		this.playNextChapter();

		// Seek to the beginning of the AudioPlayer
		// this.audioPlayer && this.audioPlayer.seek(0);
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

  	render() {
		// TODO Need a better way of checking the chapters and the book objects rather
		// than doing a check for each component run a check once and just update what we need
			
		// <TouchableOpacity onPress={() => this.props.navigation.navigate('ChapterList')}>
		// isOpen={this.state.isOpen}
					// playerRef={this.audioPlayer}

		return (
		<Subscribe to={[PlayerControlContainer]}>
		{(
			{state: {isLoaded, audioBook, chapterList, rate, 
				currentPosition, chapterDuration, paused, chapterIndex, chapterListVisible}}
		) => (
			<SafeAreaView style={styles.container}>
				<AudioPlayer
					chapterUrl={this.chapterController.loadChapterInfo(this.AUDIO, chapterList, chapterIndex)}
					that={this}	
					isPaused={paused}
					setDuration={this.setDuration}
					setCurrentTime={this.setCurrentTime}	
					onEnd={this.onEnd}
					playRate={rate}
					onError={this.onError}	
				/>
				<StatusBar hidden={true} />
				<AlbumArt url={this.chapterController.loadChapterInfo(this.IMAGE, chapterList, chapterIndex)} />
				<ChapterDetails title={this.chapterController.loadChapterInfo(this.TITLE, chapterList, chapterIndex)} /> 
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
				<TouchableOpacity onPress={() => 
					this.props.navigation.navigate('ChapterList')}>
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
	backgroundColor: Colors.lighter
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
