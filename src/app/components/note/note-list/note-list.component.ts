import {Component, OnInit} from '@angular/core';
import {NotesService} from '../../../services/notes.service';
import {NoteModel} from '../../../models/note.model';
import {MatDialog} from '@angular/material/dialog';
import {NoteCreationComponent} from '../note-creation/note-creation.component';
import {ActivatedRoute, Router} from '@angular/router';
import {NoteFiltersComponent} from '../note-filters/note-filters.component';
import {UserService} from '../../../services/user.service';
import {DeviceDetectorService} from "ngx-device-detector";
import {fromEvent, Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: 'app-note-list',
    templateUrl: './note-list.component.html',
    styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
    isLoading = false;
    isTable = false;
    isMobile = false;
    notes: NoteModel[] = [];
    noteId = -1;


    displayedColumns = ['color', 'title', 'description'];
    groupId = 0;

    constructor(
        private notesService: NotesService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private deviceService: DeviceDetectorService
    ) {}

    ngOnInit(): void {
        this.isMobile = this.deviceService.isMobile();
        this.userService.groupIdEmitted.subscribe((id) => {
            this.groupId = id;
            this.getNotes();
        });

        this.media('(max-width: 767px)').subscribe((matches) => this.isMobile = matches);
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
        if(this.isMobile) {
            this.router.navigate(['note', id]).then();
        } else {
            this.noteId = id;
        }
    }

    getNotes(): void {
        this.isLoading = true;
        const localId = localStorage.getItem('groupId');
        if (localId && this.groupId === 0) this.groupId = +localId;

        this.notesService.getNotes(this.groupId).subscribe({
            next: (notes) => {
                this.notes = notes;
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                console.error(err);
            }
        });
    }

    private media(query: string): Observable<boolean> {
        const mediaQuery = window.matchMedia(query);
        return fromEvent<MediaQueryList>(mediaQuery, 'change').pipe(
            startWith(mediaQuery),
            map((list: MediaQueryList) => list.matches)
        );
    }
}
