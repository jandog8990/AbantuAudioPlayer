/**
 * API config for issuing calls to the Abantu NodeJS server
 * TODO: May need to add client secrets and IDs, will remove 
 * the OrderId and other temporary ISBN book info
 */
export const apiConfig = {
    "baseUrl": "http://fc0f44e0.ngrok.io",
    "genres": "/android/genres/",
    "bookPlayer": "/android/books/player/",
    "purchasedBooks": "/android/purchased-books/",
    "orderId": "5c9bb9ee319d3d71c7f5e3a8",
    "isbn": "927614",
    "titleId": "A-Matter-of-Pride-and-Other-Stories"
};