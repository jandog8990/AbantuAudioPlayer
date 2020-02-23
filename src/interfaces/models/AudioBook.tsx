import { Book } from "../models/Book";
import { Chapter } from "../models/Chapter";

/**
 * Audio book model containing the Book and Chapter list objects
 */
export interface AudioBook {
    book: Book,
    chapterList: Chapter[]
}