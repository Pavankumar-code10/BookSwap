import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { BookService } from '../../services/book.service';
import { ToastrService } from 'ngx-toastr';
import { Book } from '../../../../shared/models/book.model';

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.css'],
})
export class BookStoreComponent implements OnInit {
  books: any[] = []; // Typed as any for now to include coverImage from Google API
  isProfileDropdownOpen: boolean = false;
  searchTerm: string = '';
  filteredBooks: any[] = [];
  isModalOpen = false;
  selectedISBN!: string;
  selectedUserUID!: string;
  selectedBookId!: string;
  currentUserUID: string | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private bookService: BookService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getData();
    // Subscribe to user state from AuthService
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.currentUserUID = user.uid;
        // Re-filter books if user changes
        this.filterBooks();
      }
    });
  }

  getData() {
    this.bookService.getAllBooks().subscribe((books: Book[]) => {
      this.books = books;
      // Fetch covers (N+1 issue persists but moving logic to component init for now)
      this.books.forEach(book => {
        if (book.isbn) {
          this.bookService.getBookDetailsByISBN(book.isbn).subscribe(data => {
            if (data.items && data.items.length > 0) {
              const volumeInfo = data.items[0].volumeInfo;
              book.coverImage = volumeInfo.imageLinks?.thumbnail;
            }
          });
        }
      });
      this.shuffleArray(this.books); // Randomize display order
      this.filterBooks();
    });
  }

  // Fisher-Yates Shuffle
  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  filterBooks() {
    if (this.currentUserUID) {
      this.filteredBooks = this.books.filter((book) => {
        return book.userUID !== this.currentUserUID;
      });
    } else {
      this.filteredBooks = this.books;
    }
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  logout() {
    this.authService.signOut().then(() => {
      this.currentUserUID = undefined;
      console.log('Logout Successfull');
      this.toastr.success('Logged out successfully!', 'Success');
      this.router.navigate(['/']);
    });
  }

  searchBooks() {
    this.filteredBooks = this.books.filter((book) => {
      const title = book.title ? book.title.toLowerCase() : '';
      const author = book.author ? book.author.toLowerCase() : '';
      const search = this.searchTerm.toLowerCase();

      const titleMatch = title.includes(search);
      const authorMatch = author.includes(search);

      // Also filter out own books
      const notOwnBook = this.currentUserUID ? book.userUID !== this.currentUserUID : true;

      return (titleMatch || authorMatch) && notOwnBook;
    });
  }

  openBookDetailsModal(isbn: string, userUID: string, bookId: string) {
    this.selectedISBN = isbn;
    this.selectedUserUID = userUID;
    this.selectedBookId = bookId;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  profileManagement() {
    if (this.currentUserUID) {
      this.router.navigate(['/profile', this.currentUserUID]);
    }
  }
}

