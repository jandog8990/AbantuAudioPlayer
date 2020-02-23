/**
 * Detail header shows the track, album and artist info
 * in the header for the current media selection
 */

import {Button, StyleGuide} from "../../components";
import {withPlayer, type PlayerProps} from "./Player";
import MusicAPI, {type Album} from "../api";

type DetailHeaderProps = PlayerProps & {
	album: Album
};

class DetailHeader extends React.Component<DetailHeaderProps> {
	@autobind
	play() {
		const {album} = this.props;
		const tracks = MusicAPI.tracks(album.id);
		this.props.player.play(album, tracks[0]);
	}

	render(): React.Node {
		const {album} = this.props;
		return (
				<View style={styles.root}>
					<View style={styles.header}>
						<Image {...album.picture} style={styles.image}/>
						<View>	
							<Text type="headline">{album.name}</Text>
							<Text type="footnote">{album.artist}</Text>
						</View>	
					</View>
					<View style={styles.controls}>
						<View style={styles.leftControl}>
							<Button icon="play" secondary={true} onPress={this.play}/>	
						</View>
						<View style={styles.rightControl}>
							<Button icon="shuffle" secondary={true} onPress={this.shuffle}/>	
						</View>
					</View>
				</View>
		);
	}
}
