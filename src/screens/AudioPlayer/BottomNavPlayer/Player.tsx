/**
 * Player example that uses Expo AV module for playing
 * local mp3, controlled by redux and Promise arch.
 */
import type {PlaybackStatus} from "expo/src/av/AV";

export default class Player {
	sound: Audio.Sound;

	@observable isLoaded = false;
	@observable isPlaying = false;

	@action
	togglePlay() {
		this.isPlaying = !this.isPlaying;
	}

	@action
	async play(uri: string): Promise<void> {
		// Initialization of Audio soun using AV playback	
		this.isLoaded = false;
		if (this.sound) {
			await this.sound.unloadAsync();
		}
		const {sound} = await Audio.Sound.create({uri}, {shouldPlay: true}, this.onPlaybackStatusUpdate, false);
		this.sound = sound;
	}

	// Toggle paus and play using async methods
	async toggle(): Promise<void> {
		if (this.isPlaying) {
			await this.sound.pauseAsync();
			this.isPlaying = false;
		} else {
			await this.sound.playAsync();
			this.isPlaying = true;
		}
		this.togglePlay();	// needed for changing the playing state from PlayerControls	
	}

	@autobind @action
	onPlaybackStatusUpdate(status: PlaybackStatus) {
		this.isLoaded = status.isLoaded;
		this.isPlaying = status.isPlaying;
	}

	// Export the Player as a prop to be accessed by Redux
	export type PlayerProps = {
		player: Player
	}
}
