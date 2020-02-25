/**
 * React Native Navigation Example 
 */
import React from 'react';
import { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from 'react-navigation-tabs';

// Custom screen imports
import Home from './src/screens/Home';
import LogoTitle from './src/screens/LogoTitle';
import { Icon } from 'react-native-elements';
import {
	Platform,
	Dimensions,
	TouchableOpacity
} from 'react-native';

// import ChapterListModal from './src/screens/AudioPlayer/ChapterListModal';
// import FullPlayer from './src/screens/AudioPlayer/FullPlayer';

// import the Unstated module for state management and component connection
import { Subscribe, Provider } from 'unstated';
import LibraryContainer from './src/containers/LibraryContainer';
import PlayerControlContainer from './src/containers/PlayerControlContainer';

// Props import for the audiobook and stack navigation
import { AudioBookProps } from './src/interfaces/props/AudioBookProps';
import { StackNavProps } from './src/interfaces/props/StackNavProps';
import FullPlayer from './src/screens/AudioPlayer/FullPlayer';
import {enableScreens} from 'react-native-screens';

enableScreens();

// Create instances of the LibraryContainer and PlayerControlContainer to be injected
// by the Provider to multiple screens and components
const libraryContainer = new LibraryContainer();
const playerControlContainer = new PlayerControlContainer();

declare var global: {HermesInternal: null | {}};

export default class App extends Component {

	constructor(props: any) {
		super(props);
	
		console.log("Nav props constructor:");
		console.log(this.props);
		console.log("\n");                                                                             
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
export class StackNav extends Component<AudioBookProps, any> {
	constructor(props: AudioBookProps) {
		super(props);
	}

	// Main stack for controlling the entire navigation stack for the app
	// Each screen in the stack will get its own Store depending on what it subscribes to
	/*
	navigationOptions: {
		tabBarLabel: 'Abantu Audio',
	},
	*/
	MainStack = createStackNavigator({
		Home: {
			screen: (props: StackNavProps) => (
				<Home
					{...props} 
					libraryContainer={this.props.libraryContainer}
					playerControlContainer={this.props.playerControlContainer}
				/>
			),
			navigationOptions: ({navigation}) => ({
				headerTitle: () => <LogoTitle/>,
				gesturesEnabled: false,	
				headerBackTitleVisible: false,	
				headerLeft: () =>
					<Icon
						containerStyle={{paddingLeft:20, paddingTop: 5}}
						type="ionicon"
						name={Platform.OS === "ios" ? "ios-contact" : "md-contact"}
					/>,
				headerRight: () =>
					<Icon
						containerStyle={{paddingRight:20, paddingTop: 5}}
						type="ionicon"
						name={Platform.OS === "ios" ? "ios-search" : "md-search"}
					/>	
			}),
		},
    FullPlayer: {
			screen: (props: StackNavProps) => (
				<FullPlayer
					{...props} 
					libraryContainer={this.props.libraryContainer}
					playerControlContainer={this.props.playerControlContainer}
				/>
			),
			navigationOptions: ({ navigation }) => {
					//headerLeftContainerStyle: {paddingLeft: 20},	
					//name={Platform.OS === "ios" ? "ios-down-arrow" : "md-down-arrow"}
				return {
					title: navigation.getParam('bookTitle', 'Full Player'),
					gesturesEnabled: false,	
					headerBackTitleVisible: false,	
					headerTitleStyle: { color: 'black', fontSize: 14, width : Dimensions.get('window').width/1.6, textAlign: 'center'},	
					headerStyle: { backgroundColor: 'white' },
					headerTintColor: 'black',
					headerLeft: () =>
						<TouchableOpacity onPress={() => navigation.goBack()}>	
						<Icon 
							containerStyle={{paddingLeft:20, paddingTop: 5}}
							type="material"
							color='black'	
							size={30}
							name="keyboard-arrow-down"	
						/>	
						</TouchableOpacity>,
					headerRight: () =>
						<TouchableOpacity> 
						<Icon 
							containerStyle={{paddingRight:20, paddingTop: 0}}
							type="material"
							color='black'	
							size={30}
							name="more-vert"	
						/>
						</TouchableOpacity>,
				};
			}
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

	// Create the AppContainer from the main stack navigation
	AppContainer = createAppContainer(this.MainStack);
	
	// Render the root stack navigator with the containers as props
	render() {
		return <this.AppContainer /> 
	}
}	// End of StackNav
