import React from 'react';
import {
    View,
    Text
} from 'react-native';
import { Subscribe } from 'unstated';

import { AudioStackProps } from '../interfaces/props/AudioStackProps';
import {ChapterInfo} from '../enums/ChapterInfo';
import MiniPlayer from '../screens/AudioPlayer/MiniPlayer';
import PlayerController from '../controllers/PlayerController';
import ChapterController from '../controllers/ChapterController';
import PlayerControlContainer from '../containers/PlayerControlContainer';

export default class MainBook extends PlayerController {
    chapterController; 
    AUDIO; IMAGE; TITLE; AUTHOR; 
    constructor(props) {
        super(props);
          
        // Initialize enums for the chapter controller
        this.AUDIO = ChapterInfo.AUDIO;
        this.IMAGE = ChapterInfo.IMAGE;
        this.TITLE = ChapterInfo.TITLE;
        this.AUTHOR = ChapterInfo.AUTHOR; 
        
          this.chapterController = new ChapterController();
    }

    render() {
        return (
        <Subscribe to={[PlayerControlContainer]}>
        {(
            {state: {isLoaded, paused, rate, audioBook, chapterList, chapterIndex}}
        ) => (
            <View>
                <Text>This is a test Puto!</Text>
                {
					isLoaded ?
					<View>

					<MiniPlayer
						bookTitle={audioBook.TITLE}	
						openFullPlayer={this.openFullPlayer}
						title={this.chapterController.loadChapterInfo(this.TITLE, chapterList, chapterIndex)}
						author={this.chapterController.loadBookInfo(this.AUTHOR, audioBook)}
						image={this.chapterController.loadChapterInfo(this.IMAGE, chapterList, chapterIndex)}
						onPressPlay={this.onPlay}
						onPressPause={this.onPause}
						paused={paused}	
					/> 
					</View>	
					: 
					<View/>
				}	 
            </View>
        )}
        </Subscribe>
        ); 
    }
}