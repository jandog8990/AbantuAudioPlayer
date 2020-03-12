import React, { Component } from 'react';
import {
	Animated,
	Dimensions,
} from 'react-native';

// Custom objects and models from other TypeScript files
import { AudioStackProps } from '../interfaces/props/AudioStackProps';

// Import data objects or Types for the Book and Chapter models
import { Chapter, initializeChapter } from '../models/Chapter';
import { Book, initializeBook } from '../models/Book';
import { Genre } from 'src/models/Genre';

import ChapterDetails from 'src/screens/AudioPlayer/ChapterDetails';
import PlayerControlContainer from 'src/containers/PlayerControlContainer';
import MusicControl from 'react-native-music-control';
import { Command } from '../enums/Command';


// Screen height for the current app
const screenHeight = Dimensions.get("window").height;

interface PlayerControlState {
	isLoading?: boolean,
	dataSource?: Genre[],
	selected?: Map<number, boolean>
}

/**
 * PlayeController handles all control functionality for the full player
 * as well as the embedded player -> sends state to the PlayerControlContainer
 */
export default class PlayerController extends Component<AudioStackProps, PlayerControlState> {

	constructor(props) {
		super(props);

		this.state = {
			selected: new Map<number, boolean>()
		}
	}

	// Initialize MusicControl module
	initializeMusicControl = () => {
		// Enable BG and audio interruptions	
		MusicControl.enableBackgroundMode(true);
		// MusicControl.handleAudioInterruptions(true);	
	}

	// Initialize Action control for the MusicControl
	initializeActionControl = () => {
		// MusicControl methods on action calls
		MusicControl.on(Command.play, () => {
			console.log("Music Control Playing!");
			this.playCurrentChapter();
		});
		MusicControl.on(Command.pause, () => {
			console.log("Music Control Pause!");
			this.pauseCurrentChapter();
		});
		MusicControl.on(Command.nextTrack, () => {
			console.log("Music Control Next!");
			this.playNextChapter();
		});
		MusicControl.on(Command.previousTrack, () => {
			console.log("Music Control Previous!");
			this.playPreviousChapter();
		})
	}

	// Enable MusicControl for the current player component
	enableMusicControl = () => {
		// Enable BG and audio interruptions	
		MusicControl.enableBackgroundMode(true);
		// MusicControl.handleAudioInterruptions(true);	

		// Enable playback and language options 
		MusicControl.enableControl('changePlaybackPosition', true)
		// MusicControl.enableControl('enableLanguageOption', false)
		// MusicControl.enableControl('disableLanguageOption', false)

		// Basic Controls
		MusicControl.enableControl('play', true)
		MusicControl.enableControl('pause', true)
		MusicControl.enableControl('stop', false)
		MusicControl.enableControl('nextTrack', true)
		MusicControl.enableControl('previousTrack', true)

		// Seeking settings
		// MusicControl.enableControl('seekForward', false);
		// MusicControl.enableControl('seekBackward', false);
		// MusicControl.enableControl('skipForward', false);
		// MusicControl.enableControl('skipBackward', false);

		// Android Specific Options
		// MusicControl.enableControl('setRating', true)
		MusicControl.enableControl('volume', true) // Only affected when remoteVolume is enabled
		// MusicControl.enableControl('remoteVolume', false)

		// Always allow user to close notification on swipe
		MusicControl.enableControl('closeNotification', true, { when: 'always' })

		// Default - Allow user to close notification on swipe when audio is paused
		MusicControl.enableControl('closeNotification', true, { when: 'paused' })

		// Never allow user to close notification on swipe
		MusicControl.enableControl('closeNotification', true, { when: 'never' })
	}

	/**
	 * Methods that actually interact with the FullyPlayer, the MiniPlayer,
	 * and also the SeekBar as well as other button components
	 */

	// Play method for playing the chapters
	onPlay = (data) => {
		console.log("On Press Play(data)!");
		console.log("data duration = " + data.duration);
		console.log("\n");

		this.playCurrentChapter();
	}

	// On pause from the pause button and also the slider
	onPause = () => {
		console.log("On Pause:");
		console.log("Props Player Control Container Paused = TRUE");

		// this.setState({ paused: true });
		this.props.playerControlContainer.setPaused(true);
	}

	// End method for for the player ending
	onEnd = () => {
		this.props.playerControlContainer.setBookEnded(true);
	}

	// Common functions for changing player state for the FullPlayer and the BottomPlayer
	playBook = (book) => {

		// First set the state of a playing book (will this cause race condition)
		this.props.playerControlContainer.playingBook(book);

		// Issue query for the book chapters and set the foundChapters
		// TODO: This is where the API call to the chapters endpoint will come in
		// playerStore.foundChapters();
		// playerStore.setCurrentChapter(0);
		// this.playCurrentChapter();

	}

	/**
	 * Common methods between the AudioPlayer and the back end MusicController
	 * this also allows us to share functionality between components 
	 */

	// Set the MusicControl to playing
	setControlNowPlaying = (audioBook: Book, chapter: Chapter) => {
		this.enableMusicControl();
		// rating: 0 
		MusicControl.setNowPlaying({
			title: chapter.TITLE || "",
			artwork: chapter.PHOTO_LOC || "",
			artist: audioBook.AUTHOR || "",
			album: audioBook.TITLE || "",
			genre: audioBook.GENRE || "",
			duration: chapter.DURATION || 0,
		});

		// const elapsedTime = this.props.playerControlContainer.state.currentPosition;
		const elapsedTime = this.props.playerControlContainer.state.currentTime;
		// MusicControl.setPlayback({
		// maxVolume: 10,
		// rating: MusicControl.RATING_HEART 
		MusicControl.updatePlayback({
			state: MusicControl.STATE_PLAYING,
			elapsedTime: elapsedTime,
		});
	}


	// Play the current chapter (received from play, next, back, etc)
	playCurrentChapter = () => {
		const { audioBook, chapterList, chapterIndex } = this.props.playerControlContainer.state;

		// Implement MusicControl method calls for playing a book
		let chapter = initializeChapter();

		// check that value is an array and is not empty
		if (Array.isArray(chapterList) && chapterList.length) {
			chapter = chapterList[chapterIndex];	// get the current chapter
		}

		console.log("Play Current Chapter:");
		console.log(chapter);
		console.log("\n");

		// Initialize the NowPlaying component for displaying contols
		if (chapter) {
			// TODO: may want to have a default logo for null vals	
			console.log("Music Control SetNowPlaying!");
			console.log(chapter);
			console.log("\n");

			// Set states for the current playing chapte
			const paused = false;
			const isLoaded = true;
			this.props.playerControlContainer.playingCurrentChapter(chapter.DURATION, isLoaded, paused);

			// Set the MusicControl module to now playing with playback 
			this.setControlNowPlaying(audioBook, chapter);
		}
	}

	// Play the selected chapter in the chapters list
	// This can be previous, next and select actions from the list
	playSelectedChapter = (chapterIndex: number) => {
		// First let the user know the chapter is changing
		this.props.playerControlContainer.setChanging(true);

		// Does this implement MusicControl

		// Update the states using local methods
		this.props.playerControlContainer.setCurrentPosition(0);
		this.props.playerControlContainer.setChanging(false);
		this.props.playerControlContainer.setCurrentChapter(chapterIndex);

		// Play the current chapter using state vars
		this.playCurrentChapter();
	}

	// Play the previous chapter in the chapters list
	playPreviousChapter = () => {
		const { chapterIndex } = this.props.playerControlContainer.state;
		const newIndex = chapterIndex - 1;
		this.playSelectedChapter(newIndex < 0 ? 0 : newIndex);
	}

	// Play the next chapter in the chapters lis                                                                                                                                                                                                          fff                                                         cxt
	playNextChapter = () => {
		// Get the state from the player control container
		const { chapterList, chapterIndex } = this.props.playerControlContainer.state;
		this.playSelectedChapter((chapterIndex + 1) % (chapterList.length));
	}

	// Pause the current chapter
	pauseCurrentChapter = () => {

		// Implement MusicControl update playback for pause

		// Set the player container state to paused
		this.enableMusicControl();
		this.props.playerControlContainer.setPaused(true);
	}

	// Update the play time of current chapter
	updatePlayTime = (currentTime) => {
		this.enableMusicControl();

		MusicControl.updatePlayback({
			state: MusicControl.STATE_PLAYING,
			elapsedTime: currentTime
		});

		// Set the currentTime state in the container
		this.props.playerControlContainer.setCurrentTime(currentTime);
	}
}