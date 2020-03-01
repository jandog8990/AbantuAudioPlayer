import { Chapter } from '../models/Chapter';
import { Book } from '../models/Book';
import { ChapterInfo } from '../enums/ChapterInfo';

/**
 * Chapter controller for controlling the sending
 * receiving of information on the Player state
 */
export default class ChapterController {
    // Initialize the enums for chapter info 
    AUDIO; IMAGE; TITLE; AUTHOR; 
    constructor() {
        this.AUDIO = ChapterInfo.AUDIO;
        this.IMAGE = ChapterInfo.IMAGE;
        this.TITLE = ChapterInfo.TITLE;
        this.AUTHOR = ChapterInfo.AUTHOR;
    }

    // Check that the chapter list and elements exist
	checkChapterList = (chapterList: Chapter[], chapterIndex: number):boolean => {
		return (chapterList.length != 0) && (chapterList[chapterIndex] != undefined);
	}
    // Check that the book is not null 
	checkBook = (book: Book):boolean => {
		return (book != null && book != undefined);
    }

	// Load the chpater info using the specified ChapterInfo enum and chapter list crap
	loadChapterInfo = (chapterInfo: ChapterInfo, chapterList: Chapter[], chapterIndex: number) => {
		let dataString = "";
		if (this.checkChapterList(chapterList, chapterIndex)) {
			switch (chapterInfo) {
				case (this.AUDIO): {
					dataString = chapterList[chapterIndex].AUDIO_LOC ? chapterList[chapterIndex].AUDIO_LOC : "";
					break;
				}
				case (this.IMAGE): {
					dataString = chapterList[chapterIndex].PHOTO_LOC ? chapterList[chapterIndex].PHOTO_LOC : "";
					break;
				}
				case (this.TITLE): {
					dataString = chapterList[chapterIndex].TITLE ? chapterList[chapterIndex].TITLE : "";
					break;
				}
            }
		}
		return dataString;
	}

    // Load the book info using the Book object
    loadBookInfo = (chapterInfo: ChapterInfo, book: Book): String => {
        let dataString = "";
        if (this.checkBook(book)) {
            switch (chapterInfo) {
                case (this.AUTHOR): {
                    dataString = book.AUTHOR;
                    break;
                }
            }
        }
        return dataString;
    }
}