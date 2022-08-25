import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NoteListComponent} from "./components/note/note-list/note-list.component";

const routes: Routes = [
    { path: '', redirectTo: '/notes', pathMatch: 'full' },
    { path: 'notes', component: NoteListComponent },
    { path: '**', pathMatch: 'full', component: NoteListComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
