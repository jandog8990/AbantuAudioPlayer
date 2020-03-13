/**
 * React Native Navigation Example 
 */
import React from 'react';
import { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from 'react-navigation-tabs';

// Custom screen imports
import { Icon } from 'react-native-elements';
import {
	View,	
	Platform,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import {enableScreens} from 'react-native-screens';
import styled from "styled-components";

// import the Unstated module for state management and component connection
import { Subscribe, Provider } from 'unstated';
import LibraryContainer from './src/containers/LibraryContainer';
import PlayerControlContainer from './src/containers/PlayerControlContainer';
import ChapterListModal from './src/screens/AudioPlayer/ChapterListModal';

// Props import for the audiobook and stack navigation
import { StackNavProps } from './src/interfaces/props/StackNavProps';

// Audio full player and the background audioplayer component
import Home from './src/screens/Home';
import MainBook from './src/screens/MainBook';
import FullPlayer from './src/screens/AudioPlayer/FullPlayer';
import AudioPlayer from './src/screens/AudioPlayer/AudioPlayer';

// import ChapterListModal from './src/screens/AudioPlayer/ChapterListModal';
import ChapterController from './src/controllers/ChapterController'; 
import PlayerController from './src/controllers/PlayerController';
import { ChapterInfo } from './src/enums/ChapterInfo';

// Import the navigation options for our screens
import HomeNavigation from './src/screens/navigation/HomeNavigation';
import FullPlayerNavigation from './src/screens/navigation/FullPlayerNavigation';
import StackNavigation from './src/screens/navigation/StackNavigation';

// Needed to fix the Android screen render exceptions
enableScreens();

// Create instances of the LibraryContainer and PlayerControlContainer to be injected
// by the Provider to multiple screens and components
const libraryContainer = new LibraryContainer();
const playerControlContainer = new PlayerControlContainer();

declare var global: {HermesInternal: null | {}};

export default class App extends Component<StackNavProps, any> {
	
	constructor(props) {
		super(props);
                                                                     
		// this.setTodoProps.bind(this);
	}
	
	render = () => {
		return (
		<Provider inject={[libraryContainer, playerControlContainer]}>
			<Subscribe to={[LibraryContainer, PlayerControlContainer]}>
				{(libraryContainer: LibraryContainer, playerControlContainer: PlayerControlContainer) => (
					<StackNav {...this.props}
						libraryContainer={libraryContainer}
						playerControlContainer={playerControlContainer} 
					/>	
				)}
			</Subscribe>
		</Provider>
		);
	}
}

// Class for the StackNavigation that takes props through an interface
// export class StackNav extends Component<AudioBookProps, any> {
export class StackNav extends PlayerController { 
	
	// Initialize the audio player 
	chapterController: ChapterController;
	homeNavigation;	
	fullPlayerNavigation;
	stackNavigation;	
	audioPlayer;	
	currentTime;	
	AUDIO;	
	// constructor(props: AudioBookProps) {
	constructor(props) {
		super(props);
		
		// Chapter controller for setting audio player info
		this.AUDIO = ChapterInfo.AUDIO;	
		this.chapterController = new ChapterController();
		this.currentTime = 0;

		// Full player navigation for the main app
		this.fullPlayerNavigation = new FullPlayerNavigation();
		this.homeNavigation = new HomeNavigation();
		this.stackNavigation = new StackNavigation();
	}


	// Main stack for controlling the entire navigation stack for the app
	// Each screen in the stack will get its own Store depending on what it subscribes to
	MainStack = createStackNavigator({
		Home: {
			screen: (props: StackNavProps) => (
				<Home
					{...props} 
					libraryContainer={this.props.libraryContainer}
					playerControlContainer={this.props.playerControlContainer}
				/>
			),
			navigationOptions: () => (this.homeNavigation.getNavigationOptions())
		},
		MainBook: {
			screen: (props: StackNavProps) => (
				<MainBook
					{...props} 
					libraryContainer={this.props.libraryContainer}
					playerControlContainer={this.props.playerControlContainer}
				/>
			),
			navigationOptions: () => (this.stackNavigation.getNavigationOptions())
		},	
		FullPlayer: {
			screen: (props: StackNavProps) => (
				<FullPlayer
					{...props} 
					libraryContainer={this.props.libraryContainer}
					playerControlContainer={this.props.playerControlContainer}
				/>
			),
			navigationOptions: ({ navigation }) => (this.fullPlayerNavigation.getNavigationOptions(navigation))
    	},
	}, {
		initialRouteParams: Home,
		// Header config from home screen
		defaultNavigationOptions: {
			headerStyle: {
				//backgroundColor: '#000',
				backgroundColor: 'white',
			},
			headerTintColor: '#fff',
			headerTitleStyle: {
				color: 'black',	
			},
		},
	});

	// Create the modal stack navigator to handle things like the chapter list
	RootStack = createStackNavigator({
		MainApp: {
			screen: this.MainStack,
			navigationOptions: { headerShown: false } 
		},
		ChapterList: {
			screen: (props: StackNavProps) => (
				<ChapterListModal
					{...props}
					playerControlContainer={this.props.playerControlContainer}
				/>
			),
			navigationOptions: ({ navigation }) => {
				return {
					title: 'Chapters',
					gesturesEnabled: false,	
					headerBackTitleVisible: false,	
					headerTitleStyle: { color: 'black', fontSize: 14, width : Dimensions.get('window').width/1.6, textAlign: 'center'},	
					headerStyle: { backgroundColor: 'white' },
					headerTintColor: 'black',
					headerLeft: () =>
						<TouchableOpacity onPress={() => navigation.goBack()}>	
							<Icon
								containerStyle={{paddingLeft:30, paddingTop: 5}}
								color='black'	
								size={40}	
								type="ionicon"
								name={Platform.OS === "ios" ? "ios-close" : "md-close"}
							/>
						</TouchableOpacity>
				};
			}
		}
	}, {
		// headerMode: 'none',	
		mode: 'modal'
	});

	// Create the AppContainer from the main stack navigation
	// AppContainer = createAppContainer(this.MainStack);
	AppContainer = createAppContainer(this.RootStack);

	// Audio seek for moving the player toward the seek time
	onAudioSeek = (time) => {
		this.audioPlayer.seek(time);
	}	 

	// Render the root stack navigator with the containers as props
	render() {
		const seekTime = playerControlContainer.state.seek;
		if (this.currentTime != seekTime) {
			this.currentTime = seekTime;
			this.onAudioSeek(seekTime);
		}
		return (
			<View style={{ flex: 1 }}>
			<this.AppContainer /> 
			<AudioPlayer
				chapterUrl={this.chapterController.
					loadChapterInfo(this.AUDIO, 
						playerControlContainer.state.chapterList, 
						playerControlContainer.state.chapterIndex)
					}
				that={this}	
				isPaused={playerControlContainer.state.paused}
				setDuration={this.setDuration}
				setCurrentTime={this.setCurrentTime}	
				onEnd={this.onEnd}
				playRate={playerControlContainer.state.rate}
				onError={this.onError}	
			/>		
			</View>		
		);
	}
}	// End of StackNav

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