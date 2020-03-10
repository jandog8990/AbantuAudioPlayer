import React, { Component } from 'react';
import { 
	StyleSheet,	
	SafeAreaView,	
	FlatList,
} from 'react-native';
import { Subscribe } from 'unstated';
import { Icon } from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import styled from "styled-components";

import { Chapter } from 'src/models/Chapter';
import ChapterListItem from './ChapterListItem';

import LibraryContainer from 'src/containers/LibraryContainer';
import PlayerControlContainer from '../../containers/PlayerControlContainer';
import PlayerController from '../../controllers/PlayerController';

import { StackNavProps } from '../../interfaces/props/StackNavProps';
import { AudioBookProps } from 'src/interfaces/props/AudioBookProps';

// TODO: To implement this.state for a component we need to design
// the interface like the props so that we have a map of what our
// state will be in regard to the structure
interface ChapterProps extends AudioBookProps, StackNavProps {};
/**
 * Chapter list modal screen accessed by the main book player
 * page, this page can also be used in other playlists
 */
export default class ChapterListModal extends PlayerController { 

	componentDidMount = () => {
		this.initializeSelectedMap();
	}

	// Initialize the selected map with booleans for each chapter
	initializeSelectedMap = () => {
		console.log("Initialize Selected Map:");	
		// const selected = this.props.playerControlContainer.state.selected;	
		const selected = this.state.selected;
		const selectedMap = new Map(selected!);
		// const chapterList = this.props.navigation.state.params!.chapterList; 
		const chapterList = this.props.playerControlContainer.state.chapterList;
		chapterList.forEach(chapter => {
			selectedMap.set(chapter.CHAPTER, false);
		});
		console.log(selectedMap);
		console.log("\n");

		// This should check the current playing chapter on initialization
		const isLoaded = this.props.playerControlContainer.state.isLoaded;	
		const currentChapter = this.props.playerControlContainer.state.chapterIndex;
		console.log("Is loaded = " + isLoaded);
		console.log("Current chapter = " + currentChapter);
		console.log("\n");

		selectedMap.set(currentChapter, true); 
		// selectedMap.set(currentChapter, !selected.get(currentChapter));

		this.setState({ selected: selectedMap });
		// this.props.playerControlContainer.setSelected(selectedMap);	
	}

	isChapterSelected = (chapterIndex: number): boolean => {
		const isLoaded = this.props.playerControlContainer.state.isLoaded;	
		const currentChapter = this.props.playerControlContainer.state.chapterIndex; 
		const selected = this.state.selected; 

		// const selected = this.props.playerControlContainer.state.selected;	
		console.log("Get Selected = " + chapterIndex);	
		console.log("state selected = " + selected.get(chapterIndex));	
		console.log("\n");

		const isSelected = selected.get(chapterIndex) || false;
	
		// check the current playing chapter 
		
		return isSelected; 
	}

	// Selected map selection update
	setSelected = (chapterIndex: number) => {
		console.log("Set Selected = " + chapterIndex);	
		// const selected = this.props.playerControlContainer.state.selected;	
		const selected = this.state.selected;
		console.log("state.selected:");
		console.log(selected);	
		
		const newSelected = new Map(selected);
		// const chapterList = this.props.navigation.state.params!.chapterList;

		[...newSelected.keys()].forEach(key => {
			newSelected.set(key, false);
		});

		// set the selected item to true
		newSelected.set(chapterIndex, true); 
		// newSelected.set(chapterIndex, !selected.get(chapterIndex));

		this.setState({ selected: newSelected });

		this.playSelectedChapter(chapterIndex);
	} 
	
	render() {
		const selected = this.state.selected;
		const {state: {chapterList, chapterIndex}} = this.props.playerControlContainer;	

		// selected={this.getSelected(item.CHAPTER)}
		console.log("chapterList:");
		console.log(chapterList);
		console.log("chapterIndex = " + chapterIndex);
		console.log("selected:");
		console.log(selected);
		console.log("\n");

		return (

			<SafeAreaView style={styles.listContainer}>
				<FlatList
					data={chapterList}
					renderItem={({ item }) => (
						<ChapterListItem 
							chapter={item} 
							selected={this.isChapterSelected(item.CHAPTER)}
							onSelect={() => this.setSelected(item.CHAPTER)}
						/>
					)}
					keyExtractor={item => item.CHAPTER.toString()}
					extraData={selected}
				/>
			</SafeAreaView>
		);	
	}
}

const styles = StyleSheet.create({
	listContainer: {
		flex: 1,
	},
	container: {
		position: "absolute",
		paddingTop: 20,
		height: '100%',
		width: '100%',
		backgroundColor: '#F0F0F0',
		zIndex: 100
	},
	navBarLeftButton: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	header: {
		fontSize: 20, 
		textAlign: 'center',
		flex: 2
	}
});
