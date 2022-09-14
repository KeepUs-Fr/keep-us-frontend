import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../../services/notes.service';
import { NoteModel } from '../../../models/note.model';
import { MatDialog } from '@angular/material/dialog';
import { NoteCreationComponent } from '../note-creation/note-creation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteFiltersComponent } from '../note-filters/note-filters.component';
import { UserService } from '../../../services/user.service';
import {CalendarOptions} from "@fullcalendar/angular";
import {DatePipe} from "@angular/common";

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
    isLoading = false;
    notes: NoteModel[] = [];

    displayedColumns = ['color', 'title', 'description'];
    mode = 0;
    groupId = 0;

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth'
    };

    constructor(
        private notesService: NotesService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private datePipe: DatePipe
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
                        .filterNoteByColor(
                            color,
                            +localStorage.getItem('groupId')!
                        )
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
        this.isLoading = true;
        const localId = localStorage.getItem('groupId');
        if (localId && this.groupId === 0) this.groupId = +localId;

        this.notesService.getNotes(this.groupId).subscribe({
            next: (notes) => {
                this.notes = notes;
                this.calendarOptions.events = [];

                for(let note of this.notes) {
                    const date = this.datePipe.transform(note.createDate,"yyyy-MM-dd")!;

                    this.calendarOptions.events.push({
                        title: note.title,
                        date,
                        color: note.color,
                        borderColor: note.color
                    });
                }
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                console.error(err);
            }
        });
    }

    nextMode(): void {
        switch (this.mode) {
            case 0:
                this.mode = 1;
                break;
            case 1:
                this.mode = 2;
                break;
            case 2:
                this.mode = 0;
                break;
        }
    }
}
