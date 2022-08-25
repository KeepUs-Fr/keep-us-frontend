import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NoteListComponent } from './components/note/note-list/note-list.component';
import { NoteDetailComponent } from './components/note/note-detail/note-detail.component';
import { NoteCreationComponent } from './components/note/note-creation/note-creation.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import {FlexModule} from "@angular/flex-layout";

@NgModule({
    declarations: [AppComponent, SideNavComponent, NoteListComponent, NoteDetailComponent, NoteCreationComponent, NotFoundComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        FlexModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
