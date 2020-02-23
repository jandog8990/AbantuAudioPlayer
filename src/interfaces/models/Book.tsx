/**
 * Book interface for defining the main book object for the
 * book page as well as the library and other pages with book
 * NOTE: See the Android database model for Book.java 
 */

/**
 * TODO: Set the following fields for rating and time
 *	TIME_REMAINING	-> Time remaining for the current user 
 *		-> The resume will be done in the Order object (db.ORDER.findOne())
 *	RATING			-> The start rating for the book
 *	NUM_RATINGS		-> Number of ratings from users
 */

export interface Book {
    ISBN: number,
   	ORDER_ID: number, 
	TITLE: string,
	PRICE: number,
	SUMMARY: string,
	SEARCH_ID: string,
	NUM_CHAPTERS: number,	
	TOTAL_TIME: string,
	AUTHOR: string,
    NARRATOR: string,
   	PUBLISHER: string, 
   	PUBLISHER_SEARCH_ID: string,	
	PHOTO_LOC: string,
	BANNER_LOC: string,
	DEMO_LOC: string,
	GENRE: string
}

// Initialize the book object for init
export let initializeBook = (): Book => {
    return {ISBN: 0, ORDER_ID: 0, TITLE: "", PRICE: 0, SUMMARY: "",
        SEARCH_ID: "", NUM_CHAPTERS: 0, TOTAL_TIME: "", AUTHOR: "",
        NARRATOR: "", PUBLISHER: "", PUBLISHER_SEARCH_ID: "", 
        PHOTO_LOC: "", BANNER_LOC: "", DEMO_LOC: "", GENRE: ""};
}
