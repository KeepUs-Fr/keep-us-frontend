import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../../services/notes.service';
import { NoteModel } from '../../../models/note.model';
import { MatDialog } from '@angular/material/dialog';
import { NoteCreationComponent } from '../note-creation/note-creation.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-note-list',
    templateUrl: './note-list.component.html',
    styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
    /**
     * Number of notes on grid line
     */
    valueCols: number = 1;

    notes: NoteModel[] = [];

    displayedColumns = ['title', 'description'];
    isTableMode = false;

    constructor(
        private notesService: NotesService,
        private dialog: MatDialog,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.breakPoints();
        this.getNotes();
    }

    breakPoints(): void {
        switch (true) {
            case window.innerWidth <= 730:
                this.valueCols = 1;
                break;
            case window.innerWidth > 730 && window.innerWidth <= 1020:
                this.valueCols = 2;
                break;
            case window.innerWidth > 1020 && window.innerWidth <= 1200:
                this.valueCols = 3;
                break;
            default:
                this.valueCols = 4;
        }
    }

    openCreationDialog(): void {
        const dialogRef = this.dialog.open(NoteCreationComponent);

        dialogRef.afterClosed().subscribe({
            next: (_) => {
                this.getNotes();
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    goToNoteDetail(id: number): void {
        this.router.navigate(['note', id]).then();
    }

    getNotes(): void {
        this.notesService.getNotes().subscribe({
            next: (notes) => {
                this.notes = notes;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }
}
