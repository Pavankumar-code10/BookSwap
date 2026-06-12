import { Component, OnInit } from '@angular/core';
import { ChatService, Chat } from '../../../books/services/chat.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { ProfileService } from '../../../profile/services/profile.service';

@Component({
    selector: 'app-chat-list',
    templateUrl: './chat-list.component.html',
    styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
    chats: Chat[] = [];
    isLoading: boolean = true;
    currentUserUid: string = '';

    constructor(
        private chatService: ChatService,
        private router: Router,
        private authService: AuthService,
        private profileService: ProfileService // Injected
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            if (user) {
                this.currentUserUid = user.uid;
                this.loadChats();
            }
        });
    }

    loadChats() {
        this.chatService.getUserChats().subscribe({
            next: (res: any) => {
                let rawChats: Chat[] = res.data;

                // Deduplicate chats based on the "other" participant
                // We want to keep the one with the most recent lastMessageTime
                const chatsByParticipant = new Map<string, Chat>();

                rawChats.forEach(chat => {
                    const otherUserId = chat.participants.find(p => p !== this.currentUserUid) || 'unknown';

                    if (chatsByParticipant.has(otherUserId)) {
                        const existing = chatsByParticipant.get(otherUserId)!;
                        // Replace if current chat is newer
                        if (new Date(chat.lastMessageTime) > new Date(existing.lastMessageTime)) {
                            chatsByParticipant.set(otherUserId, chat);
                        }
                    } else {
                        chatsByParticipant.set(otherUserId, chat);
                    }
                });

                this.chats = Array.from(chatsByParticipant.values())
                    .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

                this.isLoading = false;

                // Enrich chats with participant details (names/avatars)
                this.chats.forEach(chat => {
                    const otherUserId = chat.participants.find(p => p !== this.currentUserUid);

                    if (otherUserId) {
                        this.profileService.getUserProfile(otherUserId).subscribe(profile => {
                            if (profile) {
                                chat.otherParticipantName = profile.username || profile.email;
                                chat.otherParticipantAvatar = profile.avatarUrl;
                            }
                        });
                    }
                });
            },
            error: (err: any) => {
                console.error('Error loading chats:', err);
                this.isLoading = false;
            }
        });
    }

    openChat(chatId: string) {
        this.router.navigate(['/chat', chatId]);
    }
}
