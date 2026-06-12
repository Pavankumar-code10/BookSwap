import { NgModule } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { BookStoreComponent } from './features/books/pages/book-store/book-store.component';
import { ListBookComponent } from './features/books/pages/list-book/list-book.component';
import { UserProfileComponent } from './features/profile/pages/user-profile/user-profile.component';
import { TestConnectionComponent } from './components/test-connection/test-connection.component';
import { ChatListComponent } from './features/chat/pages/chat-list/chat-list.component';
import { ChatWindowComponent } from './features/chat/pages/chat-window/chat-window.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'bookStore',
    component: BookStoreComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listBook',
    component: ListBookComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:uid',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'test-connection',
    component: TestConnectionComponent
  },
  {
    path: 'chats',
    component: ChatListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'chat/:id',
    component: ChatWindowComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
