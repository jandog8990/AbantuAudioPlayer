import React from 'react';
import { 
	TouchableOpacity,	
	StyleSheet,	
	SafeAreaView,	
	Button, 
	Platform, 
	Image, 
	View, 
	Text,
	Animated,
	Dimensions,
	FlatList,
	PanResponder
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import styled from "styled-components";

import { Chapter } from 'src/models/Chapter';
import ChapterListItem from './ChapterListItem';

import LibraryContainer from 'src/containers/LibraryContainer';
import PlayerControlContainer from '../../containers/PlayerControlContainer';
import { StackNavProps } from '../../interfaces/props/StackNavProps';
import { AudioBookProps } from 'src/interfaces/props/AudioBookProps';

// Screen height for the current app
const screenHeight = Dimensions.get("window").height;

// closeChapterList(): any

// Chapter props from the parent screen
/*
interface ChapterProps {
	closeChapterList: (() => void),
	onSelectChapter: ((index:number) => void),
}
*/

interface ChapterProps extends AudioBookProps, StackNavProps {};

// Chapter state for local state
interface ChapterState {
	top: Animated.Value,
	selected: Map<number, boolean>
}

// TODO: To implement this.state for a component we need to design
// the interface like the props so that we have a map of what our
// state will be in regard to the structure

/**
 * Chapter list modal screen accessed by the main book player
 * page, this page can also be used in other playlists
 */
// <style={styles.navBarLeftButton} onPress={() => this.props.navigation.goBack()}></style>
export default class ChapterListModal extends React.Component<ChapterProps, ChapterState> {

	constructor(props) {
		super(props);

		this.state = {
			top: new Animated.Value(screenHeight),
			selected: new Map<number, boolean>()
		}
	}

	setSelected = () => {
		const selectedMap = new Map(this.state.selected);
		const chapterList = this.props.navigation.state.params!.chapterList; 
		chapterList.forEach(chapter => {
			selectedMap.set(chapter.CHAPTER, false);
		});
		this.setState({ selected: selectedMap });
	}

	getSelected = (chapterIndex: number): boolean => {
		// return this.state.selected ? this.state.selected.g3et(chapterIndex) : false;
		return this.state.selected.get(chapterIndex) || false;
	}

	// const onSelect = React.useCallback(
	onSelect = (id: number) => {
		const selected = this.state.selected;
		const newSelected = new Map(selected);
		const chapterList = this.props.navigation.state.params!.chapterList;

		[...newSelected.keys()].forEach(key => {
			newSelected.set(key, false);
		});
		// chapterList.forEach(obj => {
		// 	newSelected.set(obj.CHAPTER, false);
		// })

		newSelected.set(id, !selected.get(id));

		// Set the selected component and play the selected chapter
		this.setState({ selected: newSelected });
		// setSelected(newSelected);
		// onSelectChapter(chapterIndex);
	}
	/*	
		<AnimatedContainer style={{top: this.state.top}}>
			</AnimatedContainer>
			style={{ position: "absolute", top: 20, left: "50%", marginLeft: -22, zIndex: 1 }}
	*/	
	render() {
		// const chapterList = this.props.chapterList;
		const chapterList: Chapter[] = this.props.navigation.state.params!.chapterList;	
		console.log("Chapter List:");
		console.log(chapterList);
		console.log("\n");
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
	// }
// }
}

// export default ChapterListModal;


const styles = StyleSheet.create({
	listContainer: {
		flex: 1,
	},
	container: {
		position: "absolute",
		paddingTop: 20,
		height: '100%',
		width: '100%',
		backgroundColor: Colors.lighter,
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

/*
const ChapterListModal: React.FC<{
	closeChapterList: (() => void),
	onSelectChapter: ((index:number) => void),
	showChapters: boolean,
	chapterList: Chapter[],
	chapterIndex: number }> = ({ 
		closeChapterList, 
		onSelectChapter, 
		showChapters, 
		chapterList,
		chapterIndex }) => {
*/

/*
const ChapterListModal = ({
	closeChapterList, 
	onSelectChapter, 
	showChapters,
	isOpen,
	setIsOpen,
	chapterList,
	chapterIndex
}) => {
*/

	// Set the state for the selecting of chapters
	// const [selected, setSelected] = React.useState(new Map());
	// const [isOpen, setIsOpen] = React.useState(false);
	// let newChapterList = this.props.chapterList as Chapter[];
