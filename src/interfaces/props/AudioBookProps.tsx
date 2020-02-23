import LibraryContainer from '../../containers/LibraryContainer';
import PlayerControlContainer from '../../containers/PlayerControlContainer';

/**
 * Audiobook props for the library and player for audio playback
 */
export interface AudioBookProps {
	libraryContainer: LibraryContainer,
	playerControlContainer: PlayerControlContainer
}