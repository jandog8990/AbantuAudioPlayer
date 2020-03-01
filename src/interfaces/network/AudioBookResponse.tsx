import { AudioBook } from "../../models/AudioBook";

/**
 * Audio book response interface for the book player endpoint
 * this will contain the database object
 */
export interface AudioBookResponse {
    data: AudioBook
}
