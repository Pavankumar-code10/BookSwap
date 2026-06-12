import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    constructor(private authService: AuthService) { }

    sendInterest(bookId: string, receiverId: string): Observable<any> {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
            return of({ success: false, message: 'User not logged in' });
        }
        const currentUserUid = currentUser.uid; // Use dynamic ID

        // 1. Create Request
        const requestsKey = `requests_${receiverId}`;
        const requests = JSON.parse(localStorage.getItem(requestsKey) || '[]');
        const newRequest = {
            id: 'req_' + Date.now(),
            bookId,
            senderId: currentUserUid,
            status: 'pending',
            timestamp: new Date().toISOString()
        };
        requests.push(newRequest);
        localStorage.setItem(requestsKey, JSON.stringify(requests));

        // 2. Check for existing chat
        const allChats = JSON.parse(localStorage.getItem('global_chats') || '{}');
        let existingChatId: string | undefined;

        // Iterate to find if there is already a chat with these two participants
        for (const chatId in allChats) {
            const chat = allChats[chatId];
            if (chat.participants.includes(currentUserUid) && chat.participants.includes(receiverId)) {
                existingChatId = chatId;
                break;
            }
        }

        if (existingChatId) {
            // Update existing chat
            const chat = allChats[existingChatId];
            chat.bookId = bookId; // Update topic to latest book of interest (optional design choice)
            chat.lastMessage = 'Interest expressed for ' + bookId; // Or keep generic
            chat.lastMessageTime = new Date().toISOString();
            // Don't wipe messages, just append if needed or just update metadata

            allChats[existingChatId] = chat;
            localStorage.setItem('global_chats', JSON.stringify(allChats));
            return of({ success: true, chatId: existingChatId });
        }

        // 3. Create New Chat Session if none exists
        const chatId = `chat_${Date.now()}`;
        const chat = {
            id: chatId,
            participants: [currentUserUid, receiverId],
            bookId: bookId,
            messages: [],
            lastMessage: 'Interest expressed',
            lastMessageTime: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        allChats[chatId] = chat;
        localStorage.setItem('global_chats', JSON.stringify(allChats));

        return of({ success: true, chatId: chatId });
    }

    getSentRequests(): Observable<any> {
        return of([]);
    }

    getReceivedRequests(): Observable<any> {
        return of([]);
    }

    updateRequestStatus(requestId: string, status: 'accepted' | 'rejected'): Observable<any> {
        return of({ success: true });
    }
}
