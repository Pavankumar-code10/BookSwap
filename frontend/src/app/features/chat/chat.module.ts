import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChatListComponent } from './pages/chat-list/chat-list.component';
import { ChatWindowComponent } from './pages/chat-window/chat-window.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
    { path: 'chats', component: ChatListComponent, canActivate: [AuthGuard] },
    { path: 'chat/:id', component: ChatWindowComponent, canActivate: [AuthGuard] }
];

@NgModule({
    declarations: [
        ChatListComponent,
        ChatWindowComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class ChatModule { }
