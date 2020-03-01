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
	FlatList
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import styled from "styled-components";
import LibraryContainer from 'src/containers/LibraryContainer';
import { Chapter } from 'src/models/Chapter';
import ChapterListItem from './ChapterListItem';

// Screen height for the current app
const screenHeight = Dimensions.get("window").height;

// closeChapterList(): any
interface ChapterProps {
	closeChapterList: (() => void),
	onSelectChapter: ((index:number) => void),
	showChapters: boolean,
	chapterList: Chapter[],
	chapterIndex: number
}

// TODO: To implement this.state for a component we need to design
// the interface like the props so that we have a map of what our
// state will be in regard to the structure

/**
 * Chapter list modal screen accessed by the main book player
 * page, this page can also be used in other playlists
 */
// <style={styles.navBarLeftButton} onPress={() => this.props.navigation.goBack()}></style>
// export default class ChapterListModal extends React.Component<ChapterProps, any> {
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

	// Set the state for the selecting of chapters
	const [selected, setSelected] = React.useState(new Map());

	const top = new Animated.Value(screenHeight);

	// Open the modal for chapter list
	const openModal = () => {
		console.log("List -> openModal()!");
		Animated.spring(top, {
			toValue: screenHeight/10,
			// bounciness: 4,
			velocity: 4,
			tension: 4,
			friction: 6,
			
		}).start();
	}
	
	// Close the modal for the chapter list
	const closeModal = () => {
		Animated.spring(top, {
			toValue: screenHeight,
			velocity: 2,
			tension: 4,
			friction: 6
		}).start(() => {
			closeChapterList();
		});
	}

	const onSelect = React.useCallback(
		id => {
		  console.log("Selected:");
		  console.log(selected);
		  console.log("ID = " + id);
		  const newSelected = new Map(selected);
	
		  newSelected.forEach((val, key) => {
			newSelected.set(key, false);
		  });
	
		  newSelected.set(id, !selected.get(id));
		  console.log("---------------------------");
		  console.log("New Selected Map:");
		  newSelected.forEach((val, key) => {
			console.log(key + " : " + val);
		  });
		  console.log("---------------------------\n");
	
		  // Set the selected component and play the selected chapter
		  setSelected(newSelected);
		  onSelectChapter(chapterIndex);
		},
		[selected],
	);

	if (showChapters) {
		openModal();
		// console.log("POST Open Modal!");
		// chapterList.forEach(obj => {
		// 	console.log(obj.CHAPTER + " : " + obj.TITLE);
		// });
		// console.log("\n");
	}

	/*

	// Play the chapter on selection from the FlatList (useCallback() prevents )
	onSelect = (chapterIndex: number) => {
		// play the selected chapter
		const selected = this.state.selected;
		console.log("Play Chapter:");
		console.log("chapterIndex = " + chapterIndex);
		console.log("\n");

		// Set the selected item to highlighted in the flat list
		const newSelected = new Map(selected);
		[...newSelected.keys()].forEach(key => {
			newSelected.set(key, false);
		})
		const chapterNum = this.state.chapterList[chapterIndex].CHAPTER;
		newSelected.set(chapterNum, !selected.get(chapterNum));

		console.log("---------------------------\n");
		console.log("New Selected Map:");
		newSelected.forEach((val, key) => {
		  console.log(key + " : " + val);
		});
		console.log("---------------------------\n");
		this.setState({ selected: newSelected });
	}
	*/

	return (
	<AnimatedContainer style={{top: top}}>
		<TouchableOpacity
			onPress={() => closeModal()}
			style={{ position: "absolute", top: -20, left: "50%", marginLeft: -22, zIndex: 1 }}
		>
			<CloseView style={{ elevation: 10 }}>
			<Icon
				size={44}	
				type="ionicon"
				name={Platform.OS === "ios" ? "ios-close" : "md-close"}
				color='purple'
			/>
			</CloseView>
		</TouchableOpacity>
		<SafeAreaView style={styles.listContainer}>
			<FlatList
				data={chapterList}
				renderItem={({ item }) => (
					<ChapterListItem 
						chapter={item} 
						onSelect={onSelect} 
						selected={selected.get(item.CHAPTER)}
					/>
				)}
				keyExtractor={item => item.CHAPTER.toString()}
				extraData={selected}
			/>
		</SafeAreaView>
	</AnimatedContainer>
	);	
	// }
}

export default ChapterListModal;

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

const AnimatedContainer = Animated.createAnimatedComponent(Container);


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
