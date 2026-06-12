import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService, Chat, Message } from '../../../books/services/chat.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { ProfileService } from '../../../profile/services/profile.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chat-window',
    templateUrl: './chat-window.component.html',
    styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, OnDestroy {
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    chatId: string = '';
    chat: Chat | null = null;
    messages: Message[] = [];
    newMessage: string = '';
    currentUserUid: string = '';
    isLoading: boolean = true;
    private pollingSub?: Subscription;

    constructor(
        private route: ActivatedRoute,
        private chatService: ChatService,
        private authService: AuthService,
        private profileService: ProfileService // Injected
    ) { }

    ngOnInit(): void {
        this.authService.user$.subscribe(user => {
            if (user) {
                this.currentUserUid = user.uid;
            } else {
                this.currentUserUid = 'current_user_id_placeholder'; // Fallback for mock
            }
        });

        this.route.params.subscribe(params => {
            this.chatId = params['id'];
            if (this.chatId) {
                this.loadChatDetails();
                this.startPolling();
            }
        });

        this.chatService.activeChatMessages$.subscribe((msgList: any[]) => {
            this.messages = msgList;
            this.scrollToBottom();
        });
    }

    loadChatDetails() {
        this.chatService.getChatById(this.chatId).subscribe({
            next: (res: any) => {
                this.chat = res.data;
                this.isLoading = false;

                // Enrich with participant details
                if (this.chat) {
                    const otherUserId = this.chat.participants.find(p => p !== this.currentUserUid && p !== 'current_user_id_placeholder');

                    if (otherUserId) {
                        this.profileService.getUserProfile(otherUserId).subscribe(profile => {
                            if (profile && this.chat) {
                                this.chat.otherParticipantName = profile.username || profile.email;
                                this.chat.otherParticipantAvatar = profile.avatarUrl;
                            }
                        });
                    }
                }
            },
            error: (err: any) => {
                console.error('Error loading chat details:', err);
                this.isLoading = false;
            }
        });
    }

    startPolling() {
        if (this.pollingSub) {
            this.pollingSub.unsubscribe();
        }
        this.pollingSub = this.chatService.startMessagePolling(this.chatId).subscribe();
    }

    sendMessage() {
        if (!this.newMessage.trim()) return;

        const messageText = this.newMessage;
        this.newMessage = ''; // Clear immediately for better UX

        this.chatService.sendMessage(this.chatId, messageText).subscribe({
            next: () => {
                this.scrollToBottom();
            },
            error: (err: any) => {
                console.error('Error sending message:', err);
                this.newMessage = messageText; // Restore if failed
            }
        });
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            try {
                this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
            } catch (err) { }
        }, 100);
    }

    ngOnDestroy(): void {
        if (this.pollingSub) {
            this.pollingSub.unsubscribe();
        }
    }
}
