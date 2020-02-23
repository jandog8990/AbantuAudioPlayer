/**
 * React Native main player for the react native video streaming service
 */

import React, { Component } from 'react';
import {
  AlertIOS,
  View,
  Text,
  Image, 
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Header from './Header';
import AlbumArt from './AlbumArt';
import TrackDetails from './TrackDetails';
import SeekBar from './SeekBar';
import Controls from './Controls';
import Video from 'react-native-video';

export default class Player extends Component {
  constructor(props) {
    super(props);
	this.onLoad = this.onLoad.bind(this);
	this.onProgress = this.onProgress.bind(this);
	this.onPlay = this.onPlay.bind(this);
	this.onPause = this.onPause.bind(this);

    this.state = {
      rate: 1, 
	  paused: true,
      totalLength: 1,
      currentPosition: 0,
      selectedTrack: 0,
      repeatOn: false,
      shuffleOn: false,
	  volume: 1,
	  duration: 0.0,
	  currentTime: 0.0,
	  controls: false
	};
  }

  onLoad(data) {
    console.log("On Load Fired (data)!");
    console.log(this.state.selectedTrack);	
	console.log(data);	
	console.log(data.target);
	console.log("\n");
	this.setState({duration: data.target});
  }

  onProgress(data) {
    console.log("On Progress (data)!");
	//console.log(data);
	console.log("\n");
    this.setState({currentTime: data.currentTime});
  }

  onPlay(data) {
    console.log("On Press Play(data)!");
	//console.log(data);
	this.setState({paused: false});
	this.setState({duration: data.duration});
  }

  onPause(data) {
    console.log("On Press Pause(data)!");
	//console.log(data);
	this.setState({paused: true});
  }

  setDuration(data) {
    console.log("Set Duration (data):"); 
	console.log(data);
	console.log("\n");
    this.setState({totalLength: Math.floor(data.duration)});
  }

  setTime(data) {
    //console.log(data);
    this.setState({currentPosition: Math.floor(data.currentTime)});
  }

  seek(time) {
    time = Math.round(time);
    this.refs.audioElement && this.refs.audioElement.seek(time);
    this.setState({
      currentPosition: time,
      paused: false,
    });
  }

  onBack() {
    console.log("On Back:");
	
	if (this.state.currentPosition < 10 && this.state.selectedTrack > 0) {
      this.refs.audioElement && this.refs.audioElement.seek(0);
      this.setState({ isChanging: true });
      setTimeout(() => this.setState({
        currentPosition: 0,
        paused: false,
        totalLength: 1,
        isChanging: false,
        selectedTrack: this.state.selectedTrack - 1,
      }), 0);
    } else {
      this.refs.audioElement.seek(0);
      this.setState({
        currentPosition: 0,
      });
    }
  }

  onForward() {
    if (this.state.selectedTrack < this.props.tracks.length - 1) {
      this.refs.audioElement && this.refs.audioElement.seek(0);
      this.setState({ isChanging: true });
      setTimeout(() => this.setState({
        currentPosition: 0,
        totalLength: 1,
        paused: false,
        isChanging: false,
        selectedTrack: this.state.selectedTrack + 1,
      }), 0);
    }
  }



  render() {
    const track = this.props.tracks[this.state.selectedTrack];
	console.log("Track Object:");
	console.log(track.audioUrl);
	console.log("\n");
	console.log("State:");
	console.log(this.state);
	console.log("\n");
    //    onLoadStart={this.loadStart} // Callback when video starts to load
    //    onLoad={this.setDuration.bind(this)}    // Callback when video loads
    //    onProgress={this.setTime.bind(this)}    // Callback every ~250ms with currentTime
    //    onEnd={this.onEnd}           // Callback when playback finishes
	//const video = this.state.isChanging ? null : (
    //);
    /* 
	  	<TouchableOpacity style={styles.fullScreen} onPress={() => {this.setState({paused: !this.    state.paused})}}> 
       	</TouchableOpacity> 
	*/

    /* 
	  this.state.paused
	  this.state.volume
		eslint-disable
	*/
			//onLoad={() => {console.log("ON LOAD!!")}}    // Callback when video loads
			/*	
			source={{uri: "https://euums.baseservers.com/abantuaudio/mp4:A%20Comparative%20Study%20of%20the%20Negro%20Problem.mp4/playlist.m3u8", type: "m3u8"}}
			muted={false}	
			paused={false}   // Pauses playback entirely.
			volume={1.0}	 // Volume for player
			resizeMode="cover"           // Fill the whole screen at aspect ratio.
			repeat={true}                // Repeat forever.
			ref={ref => {
			  this.player = ref;
			}} // Store reference
   			*/ 
	/*
	 * Play the audio in the background requires:
	 * 		playInBackground=true	
	 *		ignoreSilentSwitch="ignore"	
	 */
	return (
      <View style={styles.container}>
		  <Video
			source={{uri: track.audioUrl, type: "m3u8"}} // Can be a URL or a local file.
			ref="audioElement"
			playInBackground={true}	
			ignoreSilentSwitch="ignore"	
			style={styles.audioElement}
			paused={this.state.paused}
			onLoadStart={this.loadStart} // Callback when video starts to load
			onLoad={this.setDuration.bind(this)} // Callback when video loads
			onProgress={this.setTime.bind(this)} // Callback every ~250ms with currentTime
			onEnd={() => { AlertIOS.alert('Done!') }} 
			resizeMode="cover"
			rate={this.state.rate}
			onBuffer={this.onBuffer} // Callback when remote video is buffering
			onError={this.onError} // Callback when video cannot be loaded
			fullscreen={false}
		  />
		<StatusBar hidden={true} />
        <Header message="Playing From Charts" />
        <AlbumArt url={track.albumArtUrl} />
        <TrackDetails title={track.title} artist={track.artist} />
        <SeekBar
          onSeek={this.seek.bind(this)}
          trackLength={this.state.totalLength}
          onSlidingStart={() => this.setState({paused: true})}
          currentPosition={this.state.currentPosition} />
        <Controls
          onPressRepeat={() => this.setState({repeatOn : !this.state.repeatOn})}
          repeatOn={this.state.repeatOn}
          shuffleOn={this.state.shuffleOn}
          forwardDisabled={this.state.selectedTrack === this.props.tracks.length - 1}
          onPressShuffle={() => this.setState({shuffleOn: !this.state.shuffleOn})}
          onPressPlay={this.onPlay} 
          onPressPause={this.onPause}
          onBack={this.onBack.bind(this)}
          onForward={this.onForward.bind(this)}
          paused={this.state.paused}/>
	 	<View>
		  <TouchableOpacity> 
			<View style={styles.chapterButton}> 
			  <Image source={require('../img/2x/baseline_format_list_bulleted_black_36dp.png')} style={styles.buttons} />
			  <Text style={styles.chapters}>Chapters</Text>	
		    </View>
		  </TouchableOpacity>
		</View>
	  </View>
    );
  }
}

   // tintColor: 'black',
const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white', 
  },
  chapters: {
    fontSize: 12,
    color: 'rgb(64,64,64)',
    textAlign: 'center',
  },
  buttons: {
 	width: 50,
 	height: 50,
    tintColor: 'rgb(64,64,64)'
  },
  chapterButton: {
    paddingTop: 40,	
	alignItems: 'center',
	justifyContent: 'center',
  },
  audioElement: {
    height: 0,
    width: 0,
  }
};
