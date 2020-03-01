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
import LibraryContainer from 'src/containers/LibraryContainer';
import { Chapter } from 'src/models/Chapter';
import ChapterListItem from './ChapterListItem';

// Screen height for the current app
const screenHeight = Dimensions.get("window").height;

// closeChapterList(): any

// Chapter props from the parent screen
interface ChapterProps {
	closeChapterList: (() => void),
	onSelectChapter: ((index:number) => void),
	showChapters: boolean,
	chapterList: Chapter[],
	chapterIndex: number
}

// Chapter state for local state
interface ChapterState {
	top: Animated.Value,
	isOpen: boolean,
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
			isOpen: false,
			selected: new Map<number, boolean>()
		}

		// this.setSelected();
	}

	shouldComponentUpdate = (nextProps, nextState) => {
		const render = this.props.showChapters != nextProps.showChapters;
		console.log("Next props = " + nextProps.showChapters);
		console.log("This props = " + this.props.showChapters);
		console.log("Should Render = " + render);
		console.log("\n");

		return nextProps.showChapters;
	}

	componentDidUpdate = (prevProps, prevState) => {
		this.openModal();
	}

	// Open the modal for chapter list
	openModal = () => {
		Animated.spring(this.state.top, {
			toValue: screenHeight/10,
			// bounciness: 4,
			velocity: 50,
			tension: 20,
			friction: 20,
			restSpeedThreshold: 300,
			restDisplacementThreshold: 300,
		}).start();
		// }).start(() => this.setState({isOpen: true}));
		// }).start(() => {setIsOpen(true); console.log("isOpen!");});
	}
	
	// Close the modal for the chapter list
	closeModal = () => {
		// setIsOpen(false);
		Animated.spring(this.state.top, {
			toValue: screenHeight,
			velocity: 50,
			tension: 20,
			friction: 20,
			restSpeedThreshold: 300,
			restDisplacementThreshold: 300,
		}).start(() => {this.props.closeChapterList();});
	}

	setSelected = () => {
		const selectedMap = new Map(this.state.selected);
		const chapterList = this.props.chapterList;
		chapterList.forEach(chapter => {
			selectedMap.set(chapter.CHAPTER, false);
		});
		console.log("Selected Map:");
		console.log(selectedMap);
		console.log("\n");
		this.setState({ selected: selectedMap });
	}

	getSelected = (chapterIndex: number): boolean => {
		// return this.state.selected ? this.state.selected.g3et(chapterIndex) : false;
		return this.state.selected.get(chapterIndex) || false;
	}

	// const onSelect = React.useCallback(
	onSelect = (id: number) => {
		const selected = this.state.selected;
		console.log("Selected:");
		console.log(this.state.selected);
		console.log("ID = " + id);
		const newSelected = new Map(this.state.selected);

		[...newSelected.keys()].forEach(key => {
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
		this.setState({ selected: newSelected });
		// setSelected(newSelected);
		// onSelectChapter(chapterIndex);
	}

	/*
	if (showChapters && !isOpen) {
		console.log("POST Open Modal!");
		console.log("isOpen = " + isOpen);
		// if (!isOpen) {
			openModal();
		// }
		// chapterList.forEach(obj => {
		// 	console.log(obj.CHAPTER + " : " + obj.TITLE);
		// });
		// console.log("\n");
	}
	*/

	render() {
		const chapterList = this.props.chapterList;
		return (
		<AnimatedContainer style={{top: this.state.top}}>
			<TouchableOpacity
				onPress={() => this.closeModal()}
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
							onSelect={() => this.onSelect(item.CHAPTER)} 
							selected={this.getSelected(item.CHAPTER)}
						/>
					)}
					keyExtractor={item => item.CHAPTER.toString()}
					extraData={this.state.selected}
				/>
			</SafeAreaView>
		</AnimatedContainer>
		);	
	}
	// }
// }
}

// export default ChapterListModal;

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
