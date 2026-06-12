import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { TabComponent } from './components/tab/tab.component';
import { TabsContainerComponent } from './components/tabs-container/tabs-container.component';
import { NotificationBellComponent } from './components/notification-bell/notification-bell.component';

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        TabComponent,
        TabsContainerComponent,
        NotificationBellComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HeaderComponent,
        FooterComponent,
        TabComponent,
        TabsContainerComponent,
        NotificationBellComponent
    ]
})
export class SharedModule { }
