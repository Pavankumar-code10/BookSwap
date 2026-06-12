import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../../../shared/models/book.model';

@Injectable({
    providedIn: 'root',
})
export class BookService {
    private googleApiUrl = 'https://www.googleapis.com/books/v1/volumes';

    constructor(private http: HttpClient) { }

    // Google Books API
    getBookDetailsByISBN(isbn: string): Observable<any> {
        return this.http.get(`${this.googleApiUrl}?q=isbn:${isbn}`);
    }

    // Mock Backend Operations (LocalStorage)
    getAllBooks(): Observable<Book[]> {
        const allBooks: Book[] = [];
        let hasBooks = false;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('user_books_')) {
                const books = JSON.parse(localStorage.getItem(key) || '[]');
                if (books.length > 0) hasBooks = true;
                allBooks.push(...books);
            }
        }

        // Check against 60 to allow for the new books to be processed
        // (Assuming user has ~35 currently, so 35 < 60 -> true -> re-seed including new ones)
        if (allBooks.length < 60) {
            console.log('Detected low book count. Seeding default books...');
            const defaultBooks: Book[] = [
                // Fiction
                { id: 'seed_1', isbn: '9780743273565', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', condition: 'Good', userUID: 'mock_user_1', status: 'available', genre: 'Classic Fiction', coverImage: 'http://books.google.com/books/content?id=iXn5U2IZZn0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_2', isbn: '9780446310789', title: 'To Kill a Mockingbird', author: 'Harper Lee', condition: 'Like New', userUID: 'mock_user_2', status: 'available', genre: 'Classic Fiction', coverImage: 'http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_3', isbn: '9780451524935', title: '1984', author: 'George Orwell', condition: 'Fair', userUID: 'mock_user_1', status: 'available', genre: 'Dystopian', coverImage: 'http://books.google.com/books/content?id=kotPYEqx7kMC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_4', isbn: '9780316769488', title: 'The Catcher in the Rye', author: 'J.D. Salinger', condition: 'Good', userUID: 'mock_user_3', status: 'available', genre: 'Classic Fiction', coverImage: 'http://books.google.com/books/content?id=j--EMdEfmbkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_5', isbn: '9780061120084', title: 'Brave New World', author: 'Aldous Huxley', condition: 'New', userUID: 'mock_user_2', status: 'available', genre: 'Dystopian', coverImage: 'http://books.google.com/books/content?id=5echuR9yDxgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Sci-Fi / Fantasy
                { id: 'seed_6', isbn: '9780553293357', title: 'Foundation', author: 'Isaac Asimov', condition: 'Good', userUID: 'mock_user_3', status: 'available', genre: 'Science Fiction', coverImage: 'http://books.google.com/books/content?id=iVfQAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_7', isbn: '9780441013593', title: 'Dune', author: 'Frank Herbert', condition: 'Fair', userUID: 'mock_user_4', status: 'available', genre: 'Science Fiction', coverImage: 'http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_8', isbn: '9780345391803', title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', condition: 'Like New', userUID: 'mock_user_1', status: 'available', genre: 'Science Fiction', coverImage: 'http://books.google.com/books/content?id=W-xMPgAACAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_9', isbn: '9780547928227', title: 'The Hobbit', author: 'J.R.R. Tolkien', condition: 'Good', userUID: 'mock_user_2', status: 'available', genre: 'Fantasy', coverImage: 'http://books.google.com/books/content?id=hFfHRFk8F9MC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_10', isbn: '9780345339683', title: 'The Fellowship of the Ring', author: 'J.R.R. Tolkien', condition: 'New', userUID: 'mock_user_3', status: 'available', genre: 'Fantasy', coverImage: 'http://books.google.com/books/content?id=aWZzLPhY4o0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Mystery / Thriller
                { id: 'seed_11', isbn: '9780307743657', title: 'The Shining', author: 'Stephen King', condition: 'Good', userUID: 'mock_user_4', status: 'available', genre: 'Horror', coverImage: 'http://books.google.com/books/content?id=__pvPQAACAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_12', isbn: '9780385504201', title: 'The Da Vinci Code', author: 'Dan Brown', condition: 'Like New', userUID: 'mock_user_5', status: 'available', genre: 'Thriller', coverImage: 'http://books.google.com/books/content?id=51yCpwAACAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_13', isbn: '9781250301697', title: 'The Silent Patient', author: 'Alex Michaelides', condition: 'New', userUID: 'mock_user_1', status: 'available', genre: 'Thriller', coverImage: 'http://books.google.com/books/content?id=8C1mDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_14', isbn: '9780062024968', title: 'Gone Girl', author: 'Gillian Flynn', condition: 'Good', userUID: 'mock_user_2', status: 'available', genre: 'Thriller', coverImage: 'http://books.google.com/books/content?id=KkU4nF7iI18C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_15', isbn: '9780451208637', title: 'The Godfather', author: 'Mario Puzo', condition: 'Fair', userUID: 'mock_user_3', status: 'available', genre: 'Crime', coverImage: 'http://books.google.com/books/content?id=Q4dYDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Romance
                { id: 'seed_16', isbn: '9780141439518', title: 'Pride and Prejudice', author: 'Jane Austen', condition: 'New', userUID: 'mock_user_4', status: 'available', genre: 'Romance', coverImage: 'http://books.google.com/books/content?id=s1gVAAAAYAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_17', isbn: '9780446675536', title: 'The Notebook', author: 'Nicholas Sparks', condition: 'Good', userUID: 'mock_user_5', status: 'available', genre: 'Romance', coverImage: 'http://books.google.com/books/content?id=1S2Wb5NnD64C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_18', isbn: '9781984806738', title: 'Normal People', author: 'Sally Rooney', condition: 'Like New', userUID: 'mock_user_1', status: 'available', genre: 'Romance', coverImage: 'http://books.google.com/books/content?id=c1pjDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Biography / History
                { id: 'seed_19', isbn: '9781101903223', title: 'Becoming', author: 'Michelle Obama', condition: 'New', userUID: 'mock_user_2', status: 'available', genre: 'Biography', coverImage: 'http://books.google.com/books/content?id=hi5pDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_20', isbn: '9780385514231', title: 'Team of Rivals', author: 'Doris Kearns Goodwin', condition: 'Good', userUID: 'mock_user_3', status: 'available', genre: 'History', coverImage: 'http://books.google.com/books/content?id=iyF5mAEACAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_21', isbn: '9780062301239', title: 'Hidden Figures', author: 'Margot Lee Shetterly', condition: 'Like New', userUID: 'mock_user_4', status: 'available', genre: 'History', coverImage: 'http://books.google.com/books/content?id=E_sYDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Self-Help / Philosophy
                { id: 'seed_22', isbn: '9780735213501', title: 'Atomic Habits', author: 'James Clear', condition: 'New', userUID: 'mock_user_5', status: 'available', genre: 'Self-Help', coverImage: 'http://books.google.com/books/content?id=XfFvDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_23', isbn: '9780061244186', title: 'The Alchemist', author: 'Paulo Coelho', condition: 'Good', userUID: 'mock_user_1', status: 'available', genre: 'Philosophy', coverImage: 'http://books.google.com/books/content?id=FzVjBgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_24', isbn: '9781594480003', title: 'The Kite Runner', author: 'Khaled Hosseini', condition: 'Fair', userUID: 'mock_user_2', status: 'available', genre: 'Fiction', coverImage: 'http://books.google.com/books/content?id=e7tJDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_25', isbn: '9780143124177', title: 'The Goldfinch', author: 'Donna Tartt', condition: 'Like New', userUID: 'mock_user_3', status: 'available', genre: 'Fiction', coverImage: 'http://books.google.com/books/content?id=r8KCDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // More already added
                { id: 'seed_26', isbn: '9780307277671', title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', condition: 'Good', userUID: 'mock_user_4', status: 'available', genre: 'Thriller', coverImage: 'http://books.google.com/books/content?id=dIeFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_27', isbn: '9780062457714', title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', condition: 'New', userUID: 'mock_user_5', status: 'available', genre: 'Self-Help', coverImage: 'http://books.google.com/books/content?id=yng_CwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_28', isbn: '9780743273527', title: 'Angels & Demons', author: 'Dan Brown', condition: 'Good', userUID: 'mock_user_1', status: 'available', genre: 'Thriller', coverImage: 'http://books.google.com/books/content?id=bIeFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_29', isbn: '9780553109535', title: 'A Clash of Kings', author: 'George R.R. Martin', condition: 'Good', userUID: 'mock_user_2', status: 'available', genre: 'Fantasy', coverImage: 'http://books.google.com/books/content?id=W9qFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_30', isbn: '9781400033423', title: 'Song of Solomon', author: 'Toni Morrison', condition: 'Like New', userUID: 'mock_user_3', status: 'available', genre: 'Classic Fiction', coverImage: 'http://books.google.com/books/content?id=L8Y_DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_31', isbn: '9780345806789', title: 'The Shining', author: 'Stephen King', condition: 'New', userUID: 'mock_user_4', status: 'available', genre: 'Horror', coverImage: 'http://books.google.com/books/content?id=__pvPQAACAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_32', isbn: '9780312577223', title: 'The Nightingale', author: 'Kristin Hannah', condition: 'Good', userUID: 'mock_user_5', status: 'available', genre: 'Historical Fiction', coverImage: 'http://books.google.com/books/content?id=M8eFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_33', isbn: '9780307949486', title: 'The Night Circus', author: 'Erin Morgenstern', condition: 'Like New', userUID: 'mock_user_1', status: 'available', genre: 'Fantasy', coverImage: 'http://books.google.com/books/content?id=I8eFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_34', isbn: '9780765326355', title: 'The Way of Kings', author: 'Brandon Sanderson', condition: 'Fair', userUID: 'mock_user_2', status: 'available', genre: 'Fantasy', coverImage: 'http://books.google.com/books/content?id=J8eFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_35', isbn: '9781501161933', title: 'It Ends with Us', author: 'Colleen Hoover', condition: 'New', userUID: 'mock_user_3', status: 'available', genre: 'Romance', coverImage: 'http://books.google.com/books/content?id=O8eFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // NEW BOOKS Added (10 per user approx)

                // Classics / Education
                { id: 'seed_36', isbn: '9780452284241', title: 'Dracula', author: 'Bram Stoker', condition: 'Good', userUID: 'mock_user_1', status: 'available', genre: 'Classic Fiction', coverImage: 'http://books.google.com/books/content?id=2vS1vH_pvOYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_37', isbn: '9780141439846', title: 'Jane Eyre', author: 'Charlotte Brontë', condition: 'New', userUID: 'mock_user_2', status: 'available', genre: 'Classic Fiction', coverImage: 'http://books.google.com/books/content?id=z2zCBAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_38', isbn: '9780451524935', title: 'Fahrenheit 451', author: 'Ray Bradbury', condition: 'Fair', userUID: 'mock_user_3', status: 'available', genre: 'Dystopian', coverImage: 'http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_39', isbn: '9780142437209', title: 'Moby-Dick', author: 'Herman Melville', condition: 'Like New', userUID: 'mock_user_4', status: 'available', genre: 'Adventure', coverImage: 'http://books.google.com/books/content?id=xXw8AAAAMAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_40', isbn: '9780141182551', title: 'The Grapes of Wrath', author: 'John Steinbeck', condition: 'Good', userUID: 'mock_user_5', status: 'available', genre: 'Classic Fiction', coverImage: 'http://books.google.com/books/content?id=yYkUAQAAIAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Sci-Fi / Fantasy
                { id: 'seed_41', isbn: '9780553293364', title: 'Second Foundation', author: 'Isaac Asimov', condition: 'New', userUID: 'mock_user_1', status: 'available', genre: 'Science Fiction', coverImage: 'http://books.google.com/books/content?id=iVfQAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_42', isbn: '9780441013609', title: 'Dune Messiah', author: 'Frank Herbert', condition: 'Good', userUID: 'mock_user_2', status: 'available', genre: 'Science Fiction', coverImage: 'http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_43', isbn: '9780345391810', title: 'The Restaurant at the End of the Universe', author: 'Douglas Adams', condition: 'Fair', userUID: 'mock_user_3', status: 'available', genre: 'Science Fiction', coverImage: 'http://books.google.com/books/content?id=W-xMPgAACAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_44', isbn: '9780547928227', title: 'The Silmarillion', author: 'J.R.R. Tolkien', condition: 'Like New', userUID: 'mock_user_4', status: 'available', genre: 'Fantasy', coverImage: 'http://books.google.com/books/content?id=hFfHRFk8F9MC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_45', isbn: '9780345339706', title: 'The Return of the King', author: 'J.R.R. Tolkien', condition: 'New', userUID: 'mock_user_5', status: 'available', genre: 'Fantasy', coverImage: 'http://books.google.com/books/content?id=aWZzLPhY4o0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_46', isbn: '9780439139595', title: 'Harry Potter and the Goblet of Fire', author: 'J.K. Rowling', condition: 'Good', userUID: 'mock_user_1', status: 'available', genre: 'Fantasy', coverImage: 'http://books.google.com/books/content?id=dIeFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_47', isbn: '9780439358064', title: 'Harry Potter and the Order of the Phoenix', author: 'J.K. Rowling', condition: 'Fair', userUID: 'mock_user_2', status: 'available', genre: 'Fantasy', coverImage: 'http://books.google.com/books/content?id=5iTebBW-w7QC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Drama / Fiction
                { id: 'seed_48', isbn: '9781594480003', title: 'A Thousand Splendid Suns', author: 'Khaled Hosseini', condition: 'New', userUID: 'mock_user_3', status: 'available', genre: 'Fiction', coverImage: 'http://books.google.com/books/content?id=e7tJDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_49', isbn: '9780307387899', title: 'The Road', author: 'Cormac McCarthy', condition: 'Good', userUID: 'mock_user_4', status: 'available', genre: 'Dystopian', coverImage: 'http://books.google.com/books/content?id=X88iCgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_50', isbn: '9780385737951', title: 'The Maze Runner', author: 'James Dashner', condition: 'Like New', userUID: 'mock_user_5', status: 'available', genre: 'Young Adult', coverImage: 'http://books.google.com/books/content?id=9kLHCgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Professional / Tech
                { id: 'seed_51', isbn: '9780132350884', title: 'Clean Code', author: 'Robert C. Martin', condition: 'New', userUID: 'mock_user_1', status: 'available', genre: 'Technology', coverImage: 'http://books.google.com/books/content?id=_i6bDeoCQzsC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_52', isbn: '9780201633610', title: 'Design Patterns', author: 'Erich Gamma', condition: 'Good', userUID: 'mock_user_2', status: 'available', genre: 'Technology', coverImage: 'http://books.google.com/books/content?id=Ka2eAEiQx18C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_53', isbn: '9780131103627', title: 'The C Programming Language', author: 'Brian Kernighan', condition: 'Fair', userUID: 'mock_user_3', status: 'available', genre: 'Technology', coverImage: 'http://books.google.com/books/content?id=ps2FQgAACAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Mystery / Thriller
                { id: 'seed_54', isbn: '9780385542079', title: 'The Judge\'s List', author: 'John Grisham', condition: 'New', userUID: 'mock_user_4', status: 'available', genre: 'Legal Thriller', coverImage: 'http://books.google.com/books/content?id=Q4dYDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_55', isbn: '9781524763138', title: 'The President is Missing', author: 'Bill Clinton', condition: 'Like New', userUID: 'mock_user_5', status: 'available', genre: 'Thriller', coverImage: 'http://books.google.com/books/content?id=_J0_DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_56', isbn: '9780307588371', title: 'Gone Girl', author: 'Gillian Flynn', condition: 'Good', userUID: 'mock_user_1', status: 'available', genre: 'Thriller', coverImage: 'http://books.google.com/books/content?id=KkU4nF7iI18C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_57', isbn: '9780735284687', title: 'Into the Water', author: 'Paula Hawkins', condition: 'Fair', userUID: 'mock_user_2', status: 'available', genre: 'Thriller', coverImage: 'http://books.google.com/books/content?id=8C1mDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Philosophy / Thought
                { id: 'seed_58', isbn: '9781400067886', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', condition: 'New', userUID: 'mock_user_3', status: 'available', genre: 'Psychology', coverImage: 'http://books.google.com/books/content?id=ZuKTvERuP8kC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_59', isbn: '9781847941831', title: 'Atomic Habits', author: 'James Clear', condition: 'Good', userUID: 'mock_user_4', status: 'available', genre: 'Self-Help', coverImage: 'http://books.google.com/books/content?id=XfFvDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_60', isbn: '9780062457714', title: 'Everything is F*cked', author: 'Mark Manson', condition: 'Like New', userUID: 'mock_user_5', status: 'available', genre: 'Self-Help', coverImage: 'http://books.google.com/books/content?id=yng_CwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Romance / Light Reads
                { id: 'seed_61', isbn: '9781501110368', title: 'It Starts with Us', author: 'Colleen Hoover', condition: 'New', userUID: 'mock_user_1', status: 'available', genre: 'Romance', coverImage: 'http://books.google.com/books/content?id=O8eFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_62', isbn: '9781984806745', title: 'Conversations with Friends', author: 'Sally Rooney', condition: 'Good', userUID: 'mock_user_2', status: 'available', genre: 'Fiction', coverImage: 'http://books.google.com/books/content?id=c1pjDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_63', isbn: '9781594634024', title: 'The Girl on the Train', author: 'Paula Hawkins', condition: 'Fair', userUID: 'mock_user_3', status: 'available', genre: 'Thriller', coverImage: 'http://books.google.com/books/content?id=8C1mDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // History 
                { id: 'seed_64', isbn: '9780385534246', title: 'Killers of the Flower Moon', author: 'David Grann', condition: 'New', userUID: 'mock_user_4', status: 'available', genre: 'History', coverImage: 'http://books.google.com/books/content?id=E_sYDAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_65', isbn: '9781400064168', title: 'Unbroken', author: 'Laura Hillenbrand', condition: 'Like New', userUID: 'mock_user_5', status: 'available', genre: 'History', coverImage: 'http://books.google.com/books/content?id=iyF5mAEACAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                // Misc
                { id: 'seed_66', isbn: '9780452284241', title: 'Pet Sematary', author: 'Stephen King', condition: 'Good', userUID: 'mock_user_1', status: 'available', genre: 'Horror', coverImage: 'http://books.google.com/books/content?id=__pvPQAACAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_67', isbn: '9780345806789', title: 'Doctor Sleep', author: 'Stephen King', condition: 'Good', userUID: 'mock_user_2', status: 'available', genre: 'Horror', coverImage: 'http://books.google.com/books/content?id=__pvPQAACAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_68', isbn: '9780316037914', title: 'Little Women', author: 'Louisa May Alcott', condition: 'Fair', userUID: 'mock_user_3', status: 'available', genre: 'Classic Fiction', coverImage: 'http://books.google.com/books/content?id=2vS1vH_pvOYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_69', isbn: '9780307949486', title: 'Ready Player One', author: 'Ernest Cline', condition: 'Like New', userUID: 'mock_user_4', status: 'available', genre: 'Sci-Fi', coverImage: 'http://books.google.com/books/content?id=I8eFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_70', isbn: '9780765326355', title: 'Words of Radiance', author: 'Brandon Sanderson', condition: 'New', userUID: 'mock_user_5', status: 'available', genre: 'Fantasy', coverImage: 'http://books.google.com/books/content?id=J8eFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },

                { id: 'seed_71', isbn: '9780441013593', title: 'Children of Dune', author: 'Frank Herbert', condition: 'Good', userUID: 'mock_user_1', status: 'available', genre: 'Sci-Fi', coverImage: 'http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_72', isbn: '9780553293357', title: 'I, Robot', author: 'Isaac Asimov', condition: 'Good', userUID: 'mock_user_2', status: 'available', genre: 'Sci-Fi', coverImage: 'http://books.google.com/books/content?id=iVfQAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_73', isbn: '9780140283334', title: 'Fight Club', author: 'Chuck Palahniuk', condition: 'Fair', userUID: 'mock_user_3', status: 'available', genre: 'Fiction', coverImage: 'http://books.google.com/books/content?id=xXw8AAAAMAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_74', isbn: '9780307277671', title: 'The Girl Who Played with Fire', author: 'Stieg Larsson', condition: 'New', userUID: 'mock_user_4', status: 'available', genre: 'Thriller', coverImage: 'http://books.google.com/books/content?id=dIeFjCjM10wC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
                { id: 'seed_75', isbn: '9780062457714', title: 'Will', author: 'Will Smith', condition: 'Good', userUID: 'mock_user_5', status: 'available', genre: 'Biography', coverImage: 'http://books.google.com/books/content?id=yng_CwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
            ];

            // Distribute across mock users - simple round robin or chunking
            localStorage.setItem('user_books_mock_user_1', JSON.stringify([defaultBooks[0], defaultBooks[2], defaultBooks[7], defaultBooks[12], defaultBooks[17], defaultBooks[22], defaultBooks[27], defaultBooks[32], defaultBooks[35], defaultBooks[40], defaultBooks[45], defaultBooks[50], defaultBooks[55], defaultBooks[60], defaultBooks[65], defaultBooks[70]]));
            localStorage.setItem('user_books_mock_user_2', JSON.stringify([defaultBooks[1], defaultBooks[4], defaultBooks[8], defaultBooks[13], defaultBooks[18], defaultBooks[23], defaultBooks[28], defaultBooks[33], defaultBooks[36], defaultBooks[41], defaultBooks[46], defaultBooks[51], defaultBooks[56], defaultBooks[61], defaultBooks[66], defaultBooks[71]]));
            localStorage.setItem('user_books_mock_user_3', JSON.stringify([defaultBooks[3], defaultBooks[9], defaultBooks[14], defaultBooks[19], defaultBooks[24], defaultBooks[29], defaultBooks[34], defaultBooks[37], defaultBooks[42], defaultBooks[47], defaultBooks[52], defaultBooks[57], defaultBooks[62], defaultBooks[67], defaultBooks[72]]));
            localStorage.setItem('user_books_mock_user_4', JSON.stringify([defaultBooks[6], defaultBooks[10], defaultBooks[15], defaultBooks[20], defaultBooks[25], defaultBooks[30], defaultBooks[38], defaultBooks[43], defaultBooks[48], defaultBooks[53], defaultBooks[58], defaultBooks[63], defaultBooks[68], defaultBooks[73]]));
            localStorage.setItem('user_books_mock_user_5', JSON.stringify([defaultBooks[11], defaultBooks[16], defaultBooks[21], defaultBooks[26], defaultBooks[31], defaultBooks[39], defaultBooks[44], defaultBooks[49], defaultBooks[54], defaultBooks[59], defaultBooks[64], defaultBooks[69], defaultBooks[74]]));


            return of(defaultBooks);
        }

        return of(allBooks);
    }

    getBooksByUser(uid: string): Observable<Book[]> {
        const storedBooks = localStorage.getItem(`user_books_${uid}`);
        return of(storedBooks ? JSON.parse(storedBooks) : []);
    }

    addBook(book: Book): Observable<any> {
        if (!book.userUID) throw new Error('User UID required');

        const key = `user_books_${book.userUID}`;
        const storedBooks = JSON.parse(localStorage.getItem(key) || '[]');

        // Generate a simple ID
        const newBook = { ...book, id: 'book_' + Date.now() };
        storedBooks.push(newBook);

        localStorage.setItem(key, JSON.stringify(storedBooks));
        return of(newBook);
    }

    deleteBook(bookId: string): Observable<void> {
        // This is tricky with multiple user storage keys, but we usually know the context user calls this.
        // For mock purposes, we iterate through all user book keys (inefficient but works for mock).
        // OR improved: pass userUID to deleteBook if possible, but let's try searching.

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('user_books_')) {
                let books = JSON.parse(localStorage.getItem(key) || '[]');
                const originalLength = books.length;
                books = books.filter((b: any) => b.id !== bookId);

                if (books.length < originalLength) {
                    localStorage.setItem(key, JSON.stringify(books));
                    return of(undefined);
                }
            }
        }
        return of(undefined);
    }
}
