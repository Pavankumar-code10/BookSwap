import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/auth/auth.service';
import { ProfileService } from '../../services/profile.service';
import { BookService } from '../../../books/services/book.service';
import { LocationSuggestionsService } from '../../services/location-suggestions.service';
import { SwapService } from '../../../swap/services/swap.service';
import { Book } from '../../../../shared/models/book.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  user: any;
  showUpdateModal: boolean = false;
  showDeleteModal = false;
  currentUserUID: string | undefined;
  locationSuggestions: any[] = [];
  isContactModalOpen = false;
  selectedBookForExchange: any;
  receiverEmail: string = '';
  bookToDelete: any;
  proposedBook: any = {
    title: '',
    author: '',
  };

  // Avatar Modal
  showAvatarModal = false;
  availableAvatars = [
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Buster',
    'https://api.dicebear.com/7.x/micah/svg?seed=Leo',
    'https://api.dicebear.com/7.x/micah/svg?seed=Bella',
    'https://api.dicebear.com/7.x/micah/svg?seed=Oliver',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Luna',
    'https://api.dicebear.com/7.x/notionists/svg?seed=Jack',
    'https://api.dicebear.com/7.x/open-peeps/svg?seed=Molly',
    'https://api.dicebear.com/7.x/open-peeps/svg?seed=Sam',
    'https://api.dicebear.com/7.x/bottts/svg?seed=Robo1',
    'https://api.dicebear.com/7.x/lorelei/svg?seed=Sasha'
  ];

  // Add Book Modal
  showAddBookModal = false;
  newBook: any = {
    title: '',
    author: '',
    condition: 'Good',
    isbn: '' // Optional for cover fetching
  };

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private bookService: BookService,
    private swapService: SwapService,
    private route: ActivatedRoute,
    private locationSuggestionsService: LocationSuggestionsService,
    private toastr: ToastrService
  ) {
    this.retrieveUserData();
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.currentUserUID = user.uid;
      }
    });
  }

  onLocationInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    if (query) {
      this.locationSuggestionsService.getLocationSuggestions(query).subscribe(
        (data: any) => {
          this.locationSuggestions = data;
        },
        (error) => {
          console.error('Error fetching location suggestions:', error);
        }
      );
    } else {
      this.locationSuggestions = [];
    }
  }

  selectLocation(suggestion: any) {
    this.user.location = suggestion.display_name;
    this.locationSuggestions = [];
  }

  private retrieveUserData() {
    this.route.paramMap.subscribe((params) => {
      const userUID = params.get('uid');
      if (userUID) {
        this.profileService.getUserProfile(userUID).subscribe({
          next: (userData) => {
            if (userData) {
              this.user = userData;
              // Fetch books
              this.bookService.getBooksByUser(userUID).subscribe(books => {
                this.user.listedBooks = books;
                // Fetch covers
                this.user.listedBooks.forEach((book: any) => {
                  if (book.isbn) {
                    this.bookService.getBookDetailsByISBN(book.isbn).subscribe(data => {
                      if (data.items && data.items.length > 0) {
                        book.coverImage = data.items[0].volumeInfo.imageLinks?.thumbnail;
                      }
                    });
                  }
                });
              });
            } else {
              // Should not happen with mock service returning default
              this.toastr.warning('User not found!', 'Warning');
            }
          },
          error: (err) => {
            this.toastr.error('An error occurred while fetching user data', 'Error');
          }
        });
      }
    });
  }

  toggleUpdateModal() {
    this.showUpdateModal = !this.showUpdateModal;
  }

  isCurrentUserProfile(): boolean {
    return this.currentUserUID === this.user.userUID;
  }

  showDeleteConfirmationModal(book: any) {
    this.bookToDelete = book;
    this.showDeleteModal = true;
  }

  hideDeleteModal() {
    this.bookToDelete = null;
    this.showDeleteModal = false;
  }

  proposeBookTrade(book: any) {
    if (!this.currentUserUID) {
      this.toastr.error('You must be logged in to swap', 'Error');
      return;
    }
    // Need current user details to send email
    this.profileService.getUserProfile(this.currentUserUID).subscribe(currentUser => {
      if (currentUser) {
        this.swapService.initiateSwapRequest(
          this.user.userEmail,
          book.title,
          book.author,
          currentUser,
          this.user
        );
      }
    });
  }

  updateDetails(updateForm: NgForm) {
    const newUserData = {
      firstName: updateForm.value.firstName,
      lastName: updateForm.value.lastName,
      gender: updateForm.value.gender,
      location: updateForm.value.location,
      birthday: updateForm.value.birthday,
      summary: updateForm.value.summary,
      instaId: updateForm.value.instaId,
      twitterId: updateForm.value.twitterId,
      interestedGenres: updateForm.value.interestedGenres ? updateForm.value.interestedGenres.split(',').map((g: string) => g.trim()) : []
    };

    if (this.user && this.user.userUID) {
      this.profileService.updateUserProfile(this.user.userUID, newUserData).subscribe({
        next: (updatedUser) => {
          this.toastr.success('User details updated successfully', 'Success');
          this.toggleUpdateModal();
          Object.assign(this.user, updatedUser);
        },
        error: (err) => {
          this.toastr.error('Error updating user details', 'Error');
          console.error(err);
        }
      });
    } else {
      this.toastr.error('User not found for update', 'Error');
    }
  }

  deleteBook(book: any) {
    if (book.id) {
      this.bookService.deleteBook(book.id).subscribe({
        next: () => {
          this.user.listedBooks = this.user.listedBooks.filter((b: any) => b !== book);
          this.toastr.success('The book has been deleted successfully', 'Success');
          this.hideDeleteModal();
        },
        error: (err) => this.toastr.error('Error deleting book', 'Error')
      });
    }
  }

  confirmDelete() {
    if (this.bookToDelete) {
      this.deleteBook(this.bookToDelete);
    }
  }

  // Avatar Logic
  openAvatarModal() {
    this.showAvatarModal = true;
  }

  closeAvatarModal() {
    this.showAvatarModal = false;
  }

  selectAvatar(avatarUrl: string) {
    this.user.avatarUrl = avatarUrl;
    // Save immediately
    if (this.user && this.user.userUID) {
      this.profileService.updateUserProfile(this.user.userUID, { avatarUrl: avatarUrl }).subscribe();
    }
    this.closeAvatarModal();
  }

  // Add Book Logic
  selectedImage: string | null = null;

  openAddBookModal() {
    this.showAddBookModal = true;
    this.newBook = { title: '', author: '', condition: 'Good', isbn: '' }; // Reset
    this.selectedImage = null;
  }

  closeAddBookModal() {
    this.showAddBookModal = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onAddBookSubmit() {
    if (!this.currentUserUID) {
      this.toastr.error('You must be logged in to add books', 'Error');
      return;
    }

    const bookToAdd: Book = {
      userUID: this.currentUserUID,
      title: this.newBook.title,
      author: this.newBook.author,
      condition: this.newBook.condition,
      isbn: this.newBook.isbn,
      ownerEmail: this.user.email,
      status: 'available',
      coverImage: this.selectedImage || '' // Use uploaded image if available
    };

    // If no image uploaded but ISBN provided, try to fetch
    if (!bookToAdd.coverImage && bookToAdd.isbn) {
      this.bookService.getBookDetailsByISBN(bookToAdd.isbn).subscribe({
        next: (data) => {
          if (data.items && data.items.length > 0) {
            bookToAdd.coverImage = data.items[0].volumeInfo.imageLinks?.thumbnail;
          }
          // Use placeholder if still no image
          if (!bookToAdd.coverImage) {
            bookToAdd.coverImage = 'assets/book-placeholder.jpg';
          }
          this.saveBook(bookToAdd);
        },
        error: () => {
          bookToAdd.coverImage = 'assets/book-placeholder.jpg';
          this.saveBook(bookToAdd); // Save anyway
        }
      })
    } else {
      if (!bookToAdd.coverImage) {
        bookToAdd.coverImage = 'assets/book-placeholder.jpg'; // Default
      }
      this.saveBook(bookToAdd);
    }
  }

  saveBook(book: Book) {
    this.bookService.addBook(book).subscribe({
      next: (addedBook) => {
        this.user.listedBooks.push(addedBook);
        this.toastr.success('Book added successfully!', 'Success');
        this.closeAddBookModal();
      },
      error: (err) => {
        this.toastr.error('Failed to add book', 'Error');
        console.error(err);
      }
    })
  }
}

