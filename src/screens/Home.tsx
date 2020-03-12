/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * TODO: Import react native navigation and apply the unstated-demo code
 * to this test example for the Abantu database examples
 * 
 * @format
 * @flow
 */

import React, { Component } from 'react';
//import Routes from "./Routes";

import axios from 'react-native-axios';
import {
	Dimensions,
	FlatList,
	ActivityIndicator,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	View,
	TouchableOpacity,
	Text,
	Button,
	TextInput,
	StatusBar,
	Image
} from 'react-native';


import {
	LearnMoreLinks,
	Colors,
	DebugInstructions,
	ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Subscribe } from 'unstated';

// Import the props for navigation and containers
import { GenreResponse } from 'src/interfaces/network/GenreResponse';
import { Genre } from 'src/models/Genre';
import { Book } from 'src/models/Book';
import { apiConfig } from '../config/config';

// Import the embedded player for each screen
import MiniPlayer from './AudioPlayer/MiniPlayer';
import ChapterController from '../controllers/ChapterController';
import {ChapterInfo} from '../enums/ChapterInfo';
import PlayerControlContainer from '../containers/PlayerControlContainer';
import PlayerController from '../controllers/PlayerController';

export default class Home extends PlayerController { 

	chapterController: ChapterController;
	AUDIO; IMAGE; TITLE; AUTHOR;
	constructor(props) {
		super(props);

		// Initialize enums for the chapter controller
		this.AUDIO = ChapterInfo.AUDIO;
		this.IMAGE = ChapterInfo.IMAGE;
		this.TITLE = ChapterInfo.TITLE;
		this.AUTHOR = ChapterInfo.AUTHOR;

		// Chapter controller for chapter interaction
		this.chapterController = new ChapterController();

		// State of the Home component
		this.state = {
			isLoading: true,
			dataSource: []
		}
	}


	// Server and route will come from a config service LOLz (where's Todd??)
	server = apiConfig.baseUrl;
	route = apiConfig.genres;

	fetchJSONAsync = async (urlArr: string[]) => {
		let requests: Genre[] = new Array();
		for (var i = 0; i < urlArr.length; i++) {
			console.log(urlArr[i]);
			const request = axios.get(urlArr[i]);
			console.log(request);
			requests.push(request);
		}

		console.log("Requests:");
		console.log(requests);
		console.log("\n");

		axios.all(requests).then(axios.spread((...responses: GenreResponse[]) => {
			let genreData: Genre[] = new Array();
			for (var i = 0; i < responses.length; i++) {
				genreData.push(responses[i].data);
			}
			
			this.setState({
				isLoading: false,
				dataSource: genreData
			});
		})).catch((errors: any) => {
			console.log("Errors:");
			console.log(errors);
		});
	}

	// Component did mount -> fetch network
	/* TODO:
	 * 1. Need to query the database for all genres prior to loading
	 * data into the nested FlatList views 
	 * 2. Need a BestSellers section in the DB 
	 */
	componentDidMount() {
		let server = this.server;
		let url1 = server + this.route + 'history';
		let url2 = server + this.route + 'poetry';
		let url3 = server + this.route + 'short-stories';
		let url4 = server + this.route + 'fiction';
		let url5 = server + this.route + 'biography';

		// create the url array 
		let urlArr = [url1, url2, url3, url4, url5];
		
		this.fetchJSONAsync(urlArr);
	}

	// Component will unmount -> for clean up
	componentWillUnmount() {
		// clear any elements or props that we no longer need 
	}

	// Render item function
	_renderItem(item: Book) {
		return (
			<TouchableOpacity onPress={() => {
				this.props.navigation.navigate('FullPlayer', { bookTitle: item.TITLE })
			}}>
				<Image key={item.ISBN} style={{ width: 120, height: 180, marginRight: 10, marginTop: 12 }} source={{ uri: item.PHOTO_LOC }} />
			</TouchableOpacity>
		)
	}

	render() {
		//   let pic = {
		//     uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
		//   };
		let dataSource = this.state.dataSource!;
		let genreListArr: Element[] = [];
		console.log("Genres:");
		for (var i = 0; i < dataSource.length; i++) {
			//console.log(dataSource);
			console.log(dataSource[i].genreName);
		}
		
		// Create FlatList views from the datasource of Genres
		genreListArr = dataSource.map(dataObj => (
			<View key={dataObj.genreName} style={styles.sectionListView}>
				<Text style={styles.sectionTitle}>{dataObj.genreName}</Text>
				<FlatList
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						alignSelf: 'flex-start'
					}}
					renderItem={({ item }) => this._renderItem(item)}
					keyExtractor={(book) => String(book.ISBN)}
					data={dataObj.books}
				/>
			</View>
		));

		if (this.state.isLoading) {
			return (
				<View style={{ flex: 1, paddingTop: 40 }}>
					<ActivityIndicator />
				</View>
			)
		}
		
		return (
		<Subscribe to={[PlayerControlContainer]}>
		{(
			{state: {isLoaded, paused, audioBook, chapterList, chapterIndex}}
		) => (
			<SafeAreaView style={styles.sectionContainer}>
				<ScrollView bounces={false} style={styles.genreScrollView}>
					{genreListArr}
				</ScrollView>
				{
					isLoaded ?
					<MiniPlayer
						title={this.chapterController.loadChapterInfo(this.TITLE, chapterList, chapterIndex)}
						author={this.chapterController.loadBookInfo(this.AUTHOR, audioBook)}
						image={this.chapterController.loadChapterInfo(this.IMAGE, chapterList, chapterIndex)}
						onPressPlay={this.onPlay}
						onPressPause={this.onPause}
						paused={paused}	
					/> : 
					<View/>
				}	
			</SafeAreaView>
		)}	
		</Subscribe>
		);
	}
}

const styles = StyleSheet.create({
	genreScrollView: {
		height: 100,
		top: 20,
		marginBottom: 20,
		paddingHorizontal: 24
	},
	engine: {
		position: 'absolute',
		right: 0,
	},
	body: {
		backgroundColor: Colors.white,
	},
	sectionContainer: {
		flex: 1,
		backgroundColor: Colors.lighter
	},
	sectionListView: {
		marginBottom: 20
	},
	sectionTitle: {
		fontSize: 16,
		//fontWeight: '600',
		color: Colors.black,
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
		color: Colors.dark,
	},
	highlight: {
		fontWeight: '700',
	},
	footer: {
		color: Colors.dark,
		fontSize: 12,
		fontWeight: '600',
		padding: 4,
		paddingRight: 12,
		textAlign: 'right',
	},
});
