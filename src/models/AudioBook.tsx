import { Book } from "./Book";
import { Chapter } from "./Chapter";

/**
 * Audio book model containing the Book and Chapter list objects
 */
export interface AudioBook {
    book: Book,
    chapterList: Chapter[]
}