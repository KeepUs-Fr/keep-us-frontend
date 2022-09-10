import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../../services/notes.service';
import { NoteModel } from '../../../models/note.model';
import { MatDialog } from '@angular/material/dialog';
import { NoteCreationComponent } from '../note-creation/note-creation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NoteFiltersComponent } from '../note-filters/note-filters.component';
import { UserService } from '../../../services/user.service';

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

    displayedColumns = ['color', 'title', 'description'];
    isTableMode = false;
    groupId = 0;

    constructor(
        private notesService: NotesService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.breakPoints();

        this.userService.groupIdEmitted.subscribe((id) => {
            this.groupId = id;
            this.getNotes();
        });
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

    openFilterDialog(): void {
        const dialogRef = this.dialog.open(NoteFiltersComponent);

        dialogRef.afterClosed().subscribe({
            next: (color) => {
                if (!color) {
                    this.getNotes();
                } else {
                    this.notesService
                        .filterNoteByColor(color)
                        .subscribe(
                            (filteredNotes) => (this.notes = filteredNotes)
                        );
                }
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
        const localId = localStorage.getItem('groupId');
        if (localId && this.groupId === 0) this.groupId = +localId;
        this.notesService.getNotes(this.groupId).subscribe({
            next: (notes) => {
                this.notes = notes;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.notes, event.previousIndex, event.currentIndex);
    }
}
