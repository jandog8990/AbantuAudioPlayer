import React from 'react';
import {
    StyleSheet
} from 'react-native';
import Video from 'react-native-video';

/**
 * Audio player that is used for all streaming playback, this uses
 * the React Native Video library for playing m3u8 streaming audio
    playerRef,
 */
const AudioPlayer = ({
    chapterUrl,
    that, 
    isPaused,
    setDuration,
    setCurrentTime,
    onEnd,
    playRate,
    onError
}) => (
    <Video
        source={{uri: chapterUrl, type: "m3u8"}} // Can be a URL or a local file.
        ref={(ref) => {that.audioPlayer = ref}}
        playInBackground={true}	
        playWhenInactive={true}	
        ignoreSilentSwitch="ignore"
        style={styles.audioElement}
        paused={isPaused}
        onLoad={setDuration} // Callback when video loads
        onProgress={setCurrentTime} // Callback every ~250ms with current position using time
        onEnd={onEnd} 
        resizeMode="cover"
        rate={playRate}
        onError={onError} // Callback when video cannot be loaded
        fullscreen={false}
    />
);

export default AudioPlayer;

const styles = StyleSheet.create({
    audioElement: {
        height: 0,
        width: 0
    }
}) 