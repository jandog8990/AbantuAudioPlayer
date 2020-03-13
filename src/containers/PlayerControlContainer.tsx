import {Container} from 'unstated';
import { Book, initializeBook } from '../models/Book';
import { Chapter } from 'src/models/Chapter';
import Video from 'react-native-video';

// Player control states for interacting with player
// TODO: CurrentTime may not be used in the player
interface PlayerControlState {
	audioBook: Book,
    chapterList: Chapter[],
    chapterListVisible: boolean,
    seek: number, 
    rate: number,
    paused: boolean,
    ended: boolean,
    totalLength: number, 
    currentTime: number,
	currentPosition: number,
	chapterDuration: number,
    chapterIndex: number,
    isLoading: boolean,
    isChanging: boolean,
    isLoaded: boolean,
}

/**
 * Contains all of the actions for the player control such as play, pause, next song, previous, etc...
 * NOTE: These are the global states for both the FullPlayer and the embedded MusicControl
 */
export default class PlayerControlContainer extends Container<PlayerControlState> {
    state: PlayerControlState = {
		audioBook: initializeBook(),
        chapterList: [], 
        seek: 0, 
        chapterListVisible: false,
		rate: 1,
        paused: true,
        ended: false,
        totalLength: 0.0, 
        currentTime: 0.0,
		currentPosition: 0,
		chapterDuration: 0.0,
        chapterIndex: 0,
        isLoading: true,
        isChanging: false,
        isLoaded: false,
    }

    /**
     * Player control methods for playing and interactions
     */ 
    
    // Found chapters to the selected book (when user selects book from library)
    // This should issue a query to the database for the Chapter list using ISBN
	foundChapters = (newBook: Book, newChapterList: Chapter[]) => {

        // Set the state for all full player components
        this.setState({
            isLoading: false, 
            audioBook: newBook, 
            chapterList: newChapterList,
        });
	}

    // Play book is updated from the last book. Sets:
    // 1. Sets all State values above for current chapter
    // 2. foundChapters() method in LibraryContainer
    // 3. setChapterIndex -> playCurrentChpater
    playingBook = (book: Book) => {
        // Set the state for the current Book 
        // setting paused to true => play chapter will set to true
        this.setState({
            audioBook: book,
            paused: false,
            currentTime: 0.0
        })
    }

    // Playing current chapter sets the states for the current play
    playingCurrentChapter = (duration: number, isLoaded: boolean, paused: boolean) => {
         
        this.setState({
            chapterDuration: duration,
            isLoaded: isLoaded,
            paused: paused
        })
    }

    // Playing the queued chapter (previous/next actions)
    playingQueuedChapter = (isChanging: boolean, position: number) => {
        this.setState({
            isChanging: isChanging,
            currentPosition: position
        })
    }

    /**
     * Set states for global Unstated subscribers 
     */ 
    
    // Set the seek time for the audio player 
    setSeek = (time) => {
        console.log("setSeek = " + time); 
        this.setState({ seek: time });
    }
    
    // Set the book ended boolean when we finish audio
    setBookEnded = (ended) => {
        this.setState({ ended: ended });
    }

    // Set the current Chapter using index from the action (back, next, current)
    setCurrentChapter = (index) => {
        this.setState({ chapterIndex: index });
    }

    // Set the current Chapter to paused or not paused
    setPaused = (paused) => {
        this.setState({ paused: paused });
    }

    // Set the current play time of the current chapter
    setCurrentTime = (currentTime) => {
        this.setState({ currentTime: currentTime });
    }

    // Set the isLoading state
	setLoading = (loading) => {
		this.setState({ isLoading: loading });
	}

	// Set the isChanging state for the current controller
	setChanging = (changing) => {
		this.setState({ isChanging: changing });
    }
    
	// Set audio book object
	setAudioBook = (audioBook) => {
		this.setState({ audioBook: audioBook });
		console.log("Set AudioBook:");
		console.log(this.state.audioBook);
		console.log("\n");
    }
    
    // Set chapter list of Chapter objs
	setChapterList = (chapterList) => {
		this.setState({ chapterList: chapterList });
		console.log("Set ChapterList:");
		console.log(this.state.chapterList);
		console.log("\n");
    }

    //
    
    // Set the rate of the full player component
	setRate = (rate) => {
		this.setState({ rate: rate });
	}

	// Set the current position of the chapter (used in FullPlayer)
	setCurrentPosition = (currentTime) => {
		this.setState({currentPosition: currentTime});
	}

	// Set the chapter duration for the current chapter
	setChapterDuration = (duration) => {
		this.setState({ chapterDuration: duration });
	}

	// Set the total length of the chapter 
	setTotalLength = (totalLength) => {
		this.setState({ totalLength: totalLength });
    }
    
    setChapterListVisible = (visible) => {
        this.setState({ chapterListVisible: visible });
    }
}