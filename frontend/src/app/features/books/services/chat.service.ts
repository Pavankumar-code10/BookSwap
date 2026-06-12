import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, timer, of } from 'rxjs';
import { switchMap, tap, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../core/auth/auth.service';

export interface Chat {
    id: string;
    participants: string[];
    bookId: string;
    bookTitle: string;
    lastMessage: string;
    lastMessageTime: string;
    updatedAt: string;
    otherParticipantName?: string;
    otherParticipantAvatar?: string;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    // Shared subject for real-time updates within the app directly
    private activeChatMessagesSubject = new BehaviorSubject<Message[]>([]);
    activeChatMessages$ = this.activeChatMessagesSubject.asObservable();

    constructor(private http: HttpClient, private authService: AuthService) { }

    getUserChats(): Observable<any> {
        // Fetch all chats where current user is a participant
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) return of({ success: false, data: [] });

        const currentUserUid = currentUser.uid;
        const allChats = JSON.parse(localStorage.getItem('global_chats') || '{}');
        const userChats: Chat[] = Object.values(allChats).filter((chat: any) =>
            chat.participants.includes(currentUserUid)
        ) as Chat[];

        return of({ success: true, data: userChats });
    }

    getChatById(chatId: string): Observable<any> {
        const allChats = JSON.parse(localStorage.getItem('global_chats') || '{}');
        const chat = allChats[chatId];
        return of({ success: true, data: chat });
    }

    getChatMessages(chatId: string): Observable<any> {
        const allChats = JSON.parse(localStorage.getItem('global_chats') || '{}');
        const chat = allChats[chatId];
        if (chat) {
            this.activeChatMessagesSubject.next(chat.messages || []);
            return of({ success: true, data: chat.messages });
        }
        return of({ success: false, data: [] });
    }

    sendMessage(chatId: string, text: string): Observable<any> {
        const currentUser = this.authService.getCurrentUser();
        const currentUserUid = currentUser ? currentUser.uid : 'unknown';
        const allChats = JSON.parse(localStorage.getItem('global_chats') || '{}');
        const chat = allChats[chatId];

        if (!chat) return of({ success: false, message: 'Chat not found' });

        const newMessage: Message = {
            id: 'msg_' + Date.now(),
            senderId: currentUserUid,
            text: text,
            createdAt: new Date().toISOString()
        };

        if (!chat.messages) chat.messages = [];
        chat.messages.push(newMessage);
        chat.lastMessage = text;
        chat.lastMessageTime = newMessage.createdAt;

        // Auto-reply logic
        this.checkForAutoReply(chat, currentUserUid);

        // Save
        allChats[chatId] = chat;
        localStorage.setItem('global_chats', JSON.stringify(allChats));

        // Update subject immediately
        this.activeChatMessagesSubject.next(chat.messages);

        return of({ success: true, data: newMessage });
    }

    private checkForAutoReply(chat: any, currentUserUid: string) {
        // Find other participant
        const otherUserId = chat.participants.find((p: string) => p !== currentUserUid);

        if (otherUserId && otherUserId.startsWith('mock_user_')) {
            // It's a mock user! Reply in 2 seconds.
            setTimeout(() => {
                this.generateAutoReply(chat.id, otherUserId);
            }, 2000);
        }
    }

    private generateAutoReply(chatId: string, botId: string) {
        // Reload recent state to avoid overwriting (though JS distinct run loop usage makes simple usage safe-ish here for mock)
        const allChats = JSON.parse(localStorage.getItem('global_chats') || '{}');
        const chat = allChats[chatId];
        if (!chat) return;

        const replies = [
            "That sounds great! I'm interested.",
            "Is the book still available?",
            "I can meet you this weekend to swap.",
            "Thanks for reaching out!",
            "I love that genre too.",
            "Would you accept a trade for 'Dune'?"
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const replyMsg: Message = {
            id: 'msg_' + Date.now() + '_bot',
            senderId: botId,
            text: randomReply,
            createdAt: new Date().toISOString()
        };

        if (!chat.messages) chat.messages = [];
        chat.messages.push(replyMsg);
        chat.lastMessage = randomReply;
        chat.lastMessageTime = replyMsg.createdAt;

        allChats[chatId] = chat;
        localStorage.setItem('global_chats', JSON.stringify(allChats));

        // Update active subscription if we are looking at this chat
        // We can't know for sure here easily without complex state, but we can emit if the current value matches? 
        // Or just let polling handle it.
        // But for better UX let's try to update if possible or rely on polling.
        // Since we are inside the service, we can emit.
        this.activeChatMessagesSubject.next(chat.messages);
    }

    startMessagePolling(chatId: string): Observable<any> {
        return timer(0, 3000).pipe(
            switchMap(() => this.getChatMessages(chatId)),
            retry()
        );
    }
}
