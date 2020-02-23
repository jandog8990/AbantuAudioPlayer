import {observer} from "mobx-react/native";
import {Icon} from "../../components";
import {withPlayer, type PlayerProps} from "./Player";

/**
 * Player controls view that controls the player playback from
 * multiple screens. This will be the minimized full player
 * located at the bottom of each screen.
 */

type PlayerControlsProps = PlayerProps & ThemeProps;

@observer
class PlayerControls extends React.Component<PlayerControlsProps> {
	@autobind
	toggle() {
		this.props.player.toggle();
	}

	render(): React.Node {
		const {player} = this.props;
		return {
			<View style={styles.controls}>
				{
					player.isLoaded && ( <ActivityIndicator/> )
				}
				{
					!player.isLoaded && (
						<IconButton
							name={player.playing ? "pause" : "play"}
							color={theme.palette.primary)}
							onPress={this.toggle}
						/>
					)
				}
				<View style={styles.title}>
					<Text type="headline" primary={true}>{player.track.name}</Text>
					<Text type="footnote" primary={true}>{player.track.artist}</Text>
				</View>
				<Image styles={styles.cover} {...player.album.picture} />		
			</View>
		};
	}
}

const styles = StyleSheet.create({
	controls: {
		height: StyleGuid.spacing.xLarge,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: StyleGuid.spacing.base
	},
	title: {
		alignItems: "center"
	},
	cover: {
		height: 44,
		width: 44
	}
});

export default withPlayer(withTheme(PlayerControls));
