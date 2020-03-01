/**
 * Chapter interface that contains image, audio loc, duration 
 * and all audio info for the current chapter
 */

export interface Chapter {
	ISBN: number,
	TITLE: string,
	CHAPTER: number,
	AUDIO_LOC: string,
	PHOTO_LOC: string,
	DURATION: number
}

// Initialize the Chapter object
export let initializeChapter = (): Chapter => {
	return {ISBN: 0, TITLE: "", CHAPTER: 0, 
		AUDIO_LOC: "", PHOTO_LOC: "", DURATION: 0};
}