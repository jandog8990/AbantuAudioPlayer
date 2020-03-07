import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {Chapter} from '../../models/Chapter';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Timing from './utils/Timing';

/** 
 * ChapterListItem for the ChapterListModal, this is an item
 * rendered with a FlatList in the modal
*/

const ChapterListItem: React.FC<{chapter: Chapter, 
    onSelect: ((index: number) => void),
    selected: boolean}> = ({ chapter, onSelect, selected }) => {
    const { ISBN, TITLE, CHAPTER, DURATION } = chapter;
    const timing = new Timing();
    const duration = timing.minutesAndSeconds(DURATION);
    console.log("Chapter List Itme:");
    console.log("ISBN = " + ISBN);
    console.log("\n");
    
    return (
        <TouchableOpacity
           style={[
            styles.container,
            { backgroundColor: selected ? '#C8C8C8' : '#F0F0F0'} 
          ]}
          onPress={() => {
              console.log("Chapter num = " + CHAPTER);
              console.log("Chapter title = " + TITLE);
              console.log("Selected = " + selected);
              console.log("----------------------\n");
              onSelect(CHAPTER);
          }}

        >
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.title}>{TITLE}</Text>
            <Text style={{width: 40}}>
              {duration[0] + ":" + duration[1]}
            </Text> 
      </TouchableOpacity>
    );
}

export default ChapterListItem;

const styles = StyleSheet.create({
    /* 
    item: {
      backgroundColor: Colors.lighter, 
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
    */ 
      // flexGrow: 1,
    container: {
      width: '100%', 
      flexDirection: 'row',
      justifyContent: "flex-start", 
      borderBottomColor: '#E0E0E0',
      borderRadius: 1,
      borderBottomWidth: 1,
      paddingVertical: 18,
      paddingHorizontal: 16, 
      alignSelf: 'center',
    },
    title: {
      flex: 1,
      fontSize: 16,
    },
    author: {
      fontSize: 13,
      color: '#484848',
    },
    narrator: {
      fontSize: 13,
      color: '#8239A2',
    },
    imageContainer: {
      flex: .20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 45,
      height: 68,
    },
    timeRemaining: {
      fontSize: 13,
      color: '#484848',
    },
});
