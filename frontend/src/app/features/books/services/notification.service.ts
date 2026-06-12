import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { switchMap, tap, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface Notification {
    id: string;
    recipientUID: string;
    type: string;
    title: string;
    message: string;
    relatedBookId?: string;
    relatedRequestId?: string;
    relatedChatId?: string;
    senderUID: string;
    senderName: string;
    read: boolean;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = `${environment.apiUrl}/notifications`;
    private notificationsSubject = new BehaviorSubject<Notification[]>([]);
    private unreadCountSubject = new BehaviorSubject<number>(0);
    private newNotificationSubject = new BehaviorSubject<Notification | null>(null);

    notifications$ = this.notificationsSubject.asObservable();
    unreadCount$ = this.unreadCountSubject.asObservable();
    newNotification$ = this.newNotificationSubject.asObservable();

    constructor(private http: HttpClient) {
        // Start polling for notifications every 10 seconds
        timer(0, 10000).pipe(
            switchMap(() => this.fetchNotifications()),
            retry()
        ).subscribe();
    }

    fetchNotifications(): Observable<any> {
        return this.http.get<any>(this.apiUrl).pipe(
            tap(response => {
                if (response.success) {
                    const currentNotifs = this.notificationsSubject.getValue();
                    const newNotifs = response.data as Notification[];

                    // Check for new unread notifications
                    // We check if there's any ID in newNotifs that wasn't in currentNotifs
                    // AND it is unread.
                    // (Simple check: if we have more unread ones, or just the top one is new)

                    // Better approach: Find diff
                    const existingIds = new Set(currentNotifs.map(n => n.id));
                    const latestNew = newNotifs.find(n => !existingIds.has(n.id) && !n.read);

                    if (latestNew) {
                        this.newNotificationSubject.next(latestNew);
                    }

                    this.notificationsSubject.next(newNotifs);
                    this.unreadCountSubject.next(response.unreadCount);
                }
            })
        );
    }

    markAsRead(notificationId: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
            tap(() => this.fetchNotifications().subscribe())
        );
    }

    markAllAsRead(): Observable<any> {
        return this.http.put(`${this.apiUrl}/read-all`, {}).pipe(
            tap(() => this.fetchNotifications().subscribe())
        );
    }

    deleteNotification(notificationId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${notificationId}`).pipe(
            tap(() => this.fetchNotifications().subscribe())
        );
    }
}
