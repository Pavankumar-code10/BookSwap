import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookService } from '../../services/book.service';
import { ProfileService } from '../../../profile/services/profile.service';
import { RequestService } from '../../services/request.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit {
  @Input() isbn!: string;
  @Input() ownerUid!: string;
  @Input() bookId!: string;
  @Output() closeModalEvent = new EventEmitter<void>();
  bookDetails: any;
  isModalOpen: boolean = true;
  ownerAvatarUrl: string = 'assets/default-avatar.png';
  ownerUsername: string = 'Loading...';
  isInterestedLoading: boolean = false;

  constructor(
    private bookService: BookService,
    private profileService: ProfileService,
    private requestService: RequestService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // Fetch book details based on ISBN when the modal is opened
    if (this.isbn) {
      this.bookService.getBookDetailsByISBN(this.isbn).subscribe({
        next: (data) => {
          if (data.items && data.items.length > 0) {
            this.bookDetails = data.items[0];
          }
        },
        error: (err) => console.error('Error fetching book details:', err)
      });
    }

    if (this.ownerUid) {
      this.fetchOwnerData();
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.closeModalEvent.emit();
  }

  viewUser() {
    if (this.ownerUid) {
      this.router.navigate(['/profile', this.ownerUid]);
      this.closeModal();
    }
  }

  expressedInterest() {
    if (!this.bookId || !this.ownerUid) {
      this.toastr.error('Missing book or owner information');
      return;
    }

    this.isInterestedLoading = true;
    this.requestService.sendInterest(this.bookId, this.ownerUid).subscribe({
      next: (res) => {
        this.isInterestedLoading = false;
        if (res.success) {
          this.toastr.success(
            'Request Sent',
            `Request sent to ${this.ownerUsername} for "${this.bookDetails?.volumeInfo?.title || 'the book'}"`
          );
          // Navigate to chat if chatId is returned
          if (res.chatId) {
            this.router.navigate(['/chat', res.chatId]);
            this.closeModal();
          }
        }
      },
      error: (err) => {
        this.isInterestedLoading = false;
        this.toastr.error(err.error?.error || 'Failed to send interest');
        console.error('Error expressing interest:', err);
      }
    });
  }

  fetchOwnerData() {
    this.profileService.getUserProfile(this.ownerUid).subscribe({
      next: (response: any) => {
        const userData = response.data || response;
        if (userData) {
          this.ownerAvatarUrl = userData.photoURL || userData.avatarUrl || 'assets/default-avatar.png';
          this.ownerUsername = userData.displayName || userData.username || 'Book Owner';
        } else {
          this.ownerUsername = 'Unknown Owner';
        }
      },
      error: (err) => {
        console.error('Error fetching owner data:', err);
        this.ownerUsername = 'Error Loading Owner';
      }
    });
  }
}

