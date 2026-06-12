import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../../features/books/services/notification.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-notification-bell',
    templateUrl: './notification-bell.component.html',
    styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit {
    notifications: Notification[] = [];
    unreadCount: number = 0;
    isDropdownOpen: boolean = false;

    constructor(
        private notificationService: NotificationService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.notificationService.notifications$.subscribe(notifs => {
            this.notifications = notifs;
        });

        this.notificationService.unreadCount$.subscribe(count => {
            this.unreadCount = count;
        });

        this.notificationService.newNotification$.subscribe(notif => {
            if (notif) {
                this.toastr.info(notif.message, notif.title, {
                    timeOut: 5000,
                    positionClass: 'toast-top-right',
                    tapToDismiss: true
                }).onTap.subscribe(() => this.handleNotificationClick(notif));
            }
        });
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
        if (this.isDropdownOpen && this.unreadCount > 0) {
            // Potentially mark all as read when opening? 
            // Or let user click each. For now, just show.
        }
    }

    handleNotificationClick(notif: Notification) {
        this.notificationService.markAsRead(notif.id).subscribe();
        this.isDropdownOpen = false;

        if (notif.relatedChatId) {
            this.router.navigate(['/chat', notif.relatedChatId]);
        } else if (notif.relatedBookId) {
            // Could open book detail modal if store is active, or navigate to store
            this.router.navigate(['/bookStore']);
        }
    }

    markAllRead() {
        this.notificationService.markAllAsRead().subscribe();
    }
}
