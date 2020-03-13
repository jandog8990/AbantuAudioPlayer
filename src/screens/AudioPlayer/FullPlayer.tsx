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

  	render() {
		// TODO Need a better way of checking the chapters and the book objects rather
		// than doing a check for each component run a check once and just update what we need
			
		// <TouchableOpacity onPress={() => this.props.navigation.navigate('ChapterList')}>
		// isOpen={this.state.isOpen}
					// playerRef={this.audioPlayer}
		/*	
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
		*/	
		return (
		<Subscribe to={[PlayerControlContainer]}>
		{(
			{state: {isLoaded, audioBook, chapterList, rate, 
				currentPosition, chapterDuration, paused, chapterIndex, chapterListVisible}}
		) => (
			<SafeAreaView style={styles.container}>

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
 	width: 50,
 	height: 50,
    tintColor: 'purple'
  },
  chapterButton: {
    paddingTop: 40,	
	alignItems: 'center',
	justifyContent: 'center',
  },
  audioElement: {
    height: 0,
    width: 0,
  }
});
