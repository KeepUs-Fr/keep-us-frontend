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
import { RemoveNoteComponent } from './components/note/note-detail/remove-note/remove-note.component';
import { AddGroupComponent } from './components/side-nav/add-group/add-group.component';

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
        RemoveNoteComponent,
        AddGroupComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
