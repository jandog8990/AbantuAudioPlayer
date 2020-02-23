/**
 * Music navigator example that shows the nested tab player at 
 * the bottom of each screen within the app. This allows for
 * continuous playback of a book no matter the screen.
 */
import type {NavigationProps} from "../components/Navigation";

const tabs = [
	{ key: "Library", label: "Library", icon: "music" },
	{ key: "Discovery", label: "Discovery", icon: "book" },
	{ key: "MusicalProfile", label: "Profile", icon: "user" }
];

const LibraryNavigator = StackNavigator({
	Library: { screen: Library },
	Album: { screen: Album }
}, StackNavigatorOptions);

export const MusicTabNavigator = TabNavigator({
	Library: { screen: LibraryNavigator }
}, {
	animationEnabled: false,
	tabBarComponent: ({ navigation }: NavigationProps<>) => <MusicTabBar {...{navigation, tabs}} />,
	tabBarPosition: "bottom",
	swipeEnabled: false
});

export class MusicNavigator extends React.Component<{}> {
	render(): React.Node {

	return (
		<Provider player={new Player()}>
			<MusicTabNavigator/>
		</Provider>
	);
}
