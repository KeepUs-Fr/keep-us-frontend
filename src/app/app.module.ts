import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { NoteListComponent } from './components/note/note-list/note-list.component';
import { NoteDetailComponent } from './components/note/note-detail/note-detail.component';
import { NoteCreationComponent } from './components/note/note-creation/note-creation.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { NoteColorPaletteComponent } from './components/note/note-color-palette/note-color-palette.component';
import { NoteFiltersComponent } from './components/note/note-filters/note-filters.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { SignUpComponent } from './components/authentication/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './components/profile/profile.component';
import { AvatarListComponent } from './components/profile/avatar-list/avatar-list.component';
import { RemoveModalComponent } from './components/modals/remove-modal/remove-modal.component';
import { AddModalComponent } from './components/modals/add-modal/add-modal.component';
import { FooterComponent } from './components/footer/footer.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DatePipe } from "@angular/common";
import { CalendarComponent } from './components/calendar/calendar.component';
import {ExtendedModule} from "@angular/flex-layout";

FullCalendarModule.registerPlugins([
    dayGridPlugin,
    interactionPlugin
]);

@NgModule({
    declarations: [
        AppComponent,
        SideNavComponent,
        NoteListComponent,
        NoteDetailComponent,
        NoteCreationComponent,
        NotFoundComponent,
        NoteColorPaletteComponent,
        NoteFiltersComponent,
        LoginComponent,
        SignUpComponent,
        ProfileComponent,
        AvatarListComponent,
        RemoveModalComponent,
        AddModalComponent,
        FooterComponent,
        CalendarComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        MaterialModule,
        FullCalendarModule,
        ExtendedModule
    ],
    providers: [DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule {}
