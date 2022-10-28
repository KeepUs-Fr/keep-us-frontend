import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../../services/notes.service';
import { NoteModel } from '../../../models/note.model';
import { MatDialog } from '@angular/material/dialog';
import { NoteCreationComponent } from '../note-creation/note-creation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteFiltersComponent } from '../note-filters/note-filters.component';
import { UserService } from '../../../services/user.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-note-list',
    templateUrl: './note-list.component.html',
    styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
    isLoading = false;
    isTable = false;
    isMobile$ = this.responsiveService.isMobile$;
    notes: NoteModel[] = [];
    noteId: number | undefined;
    displayedColumns = ['color', 'title', 'description'];
    groupId = 0;

    constructor(
        private notesService: NotesService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private responsiveService: ResponsiveService
    ) {}

    ngOnInit(): void {
        const id = localStorage.getItem('groupId');

        if (id) {
            this.noteId = undefined;
            this.groupId = +id;
            this.getNotes();
        }

        this.userService.groupIdEmitted.subscribe((id) => {
            this.noteId = undefined;
            this.groupId = id;
            this.getNotes();
        });
    }

    openCreationDialog(): void {
        const dialogRef = this.dialog.open(NoteCreationComponent, {
            width: '600px'
        });

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

    goToNoteDetail(id: number) {
        this.noteId = id;
        this.isMobile$.pipe(untilDestroyed(this)).subscribe((result) => {
            if (result) this.router.navigate(['note', this.noteId]).then();
        });
    }

    reload(doReload: boolean) {
        if (doReload) this.getNotes();
    }

    private getNotes() {
        this.isLoading = true;
        this.notesService.getNotes(this.groupId).subscribe({
            next: (notes) => {
                this.notes = notes.reverse();
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                console.error(err);
            }
        });
    }
}
