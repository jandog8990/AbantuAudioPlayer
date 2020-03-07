import React from 'react';
import { 
	StyleSheet,	
	SafeAreaView,	
	FlatList,
} from 'react-native';
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

	getSelected = (chapterIndex: number): boolean => {
		console.log("Get Selected = " + chapterIndex);	
		console.log("state selected = " + this.state.selected!.get(chapterIndex));	
		console.log("\n");

		return this.state.selected!.get(chapterIndex) || false;
	}

	// const onSelect = React.useCallback(
	onSelect = async(id: number) => {
		console.log("On Select = " + id);	
		const selected = this.state.selected;
		console.log("selected = " + selected);	
		
		const newSelected = new Map(selected!);
		const chapterList = this.props.navigation.state.params!.chapterList;

		[...newSelected.keys()].forEach(key => {
			newSelected.set(key, false);
		});

		newSelected.set(id, !selected!.get(id));

		// play the selected chapter using the PlayerController
		await this.playSelectedChapter(id);
		
		// Set the selected component and play the selected chapter
		this.setState({ selected: newSelected });

	}
	
	render() {
		const chapterList: Chapter[] = this.props.navigation.state.params!.chapterList;	
		const chapterIndex: number = this.props.playerControlContainer.state.chapterIndex;	
		// selected={this.getSelected(item.CHAPTER)}
		console.log("chapterIndex = " + chapterIndex);

		return (
			<SafeAreaView style={styles.listContainer}>
				<FlatList
					data={chapterList}
					renderItem={({ item }) => (
						<ChapterListItem 
							chapter={item} 
							onSelect={() => this.onSelect(item.CHAPTER)} 
							selected={this.getSelected(item.CHAPTER)}
						/>
					)}
					keyExtractor={item => item.CHAPTER.toString()}
					extraData={this.state.selected}
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
