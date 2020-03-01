import { Container } from 'unstated'
import { Book } from '../models/Book';

interface LibraryState {
	bookList: Book[],
	showBooks: boolean
}

/**
 * Library container controls all of the book and chapter
 * information needed for playing each book
 */
export default class LibraryContainer extends Container<LibraryState> {
	state: LibraryState = {
		bookList: [],
		showBooks: false
	}

	// Add book to the library (select purchased book in the library)
	addBook = (book: Book) => {
		const bookList = [...this.state.bookList]
		bookList.push(book)
		this.setState({ bookList });
	}

	// Show all books in the list (select the Library icon)
	toggleVisibility = () => {
		this.setState({
			showBooks: !this.state.showBooks
		})
	}
}
