import { Book } from "./Book";

/**
 * Genre model that holds the Genre and corresponding books
 */
export interface Genre {
    books: Book[],
    genreName: string
}