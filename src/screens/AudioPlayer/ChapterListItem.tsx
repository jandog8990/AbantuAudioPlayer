import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {Chapter} from '../../models/Chapter';

/** 
 * ChapterListItem for the ChapterListModal, this is an item
 * rendered with a FlatList in the modal
*/

const ChapterListItem: React.FC<{chapter: Chapter, 
    onSelect: ((index: number) => void),
    selected: boolean}> = ({ chapter, onSelect, selected }) => {
    const { ISBN, TITLE, CHAPTER, DURATION } = chapter;
    
    return (
        <TouchableOpacity
          onPress={() => {
              console.log("Chapter num = " + CHAPTER);
              console.log("Chapter title = " + TITLE);
              console.log("Selected = " + selected);
              console.log("----------------------\n");
              onSelect(CHAPTER);
          }}
          style={[
            styles.item,
            { backgroundColor: selected ? '#6e3b6e' : '#f9c2ff' },
          ]}
        >
        <Text style={styles.title}>{TITLE}</Text>
      </TouchableOpacity>
    );
}

export default ChapterListItem;

const styles = StyleSheet.create({
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  });