import { Component, OnInit } from '@angular/core';
import { NotesService } from '../../../services/notes.service';
import { NoteModel } from '../../../models/note.model';
import { MatDialog } from '@angular/material/dialog';
import { NoteCreationComponent } from '../note-creation/note-creation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { AnimationOptions } from "ngx-lottie";

@UntilDestroy()
@Component({
    selector: 'app-note-list',
    templateUrl: './note-list.component.html',
    styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
    isLoading = false;
    isTable = false;
    showCalendar = false;
    isMobile$ = this.responsiveService.isMobile$;
    notes: NoteModel[] = [];
    noteId: number | undefined;
    displayedColumns = ['title', 'description'];
    groupId = 0;

    lottieNoDetails: AnimationOptions = {
        path: '/assets/lottie/no-details.json',
        autoplay: true,
        loop: true
    };

    constructor(
        private notesService: NotesService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private responsiveService: ResponsiveService
    ) {}

    ngOnInit() {
        const id = localStorage.getItem('groupId');
        if (id && id !== '-1') {
            this.noteId = undefined;
            this.groupId = +id;
            this.getNotes();
        }

        this.userService.groupIdEmitted.subscribe(change => {
            if (change.clearNoteId)
                this.noteId = undefined;

            this.groupId = change.id;
            this.getNotes();
        });
    }

    openCreationDialog() {
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

    goToNoteDetail(id: number) {
        this.noteId = id;
        this.isMobile$.pipe(untilDestroyed(this)).subscribe((result) => {
            if (result) this.router.navigate(['note', this.noteId]).then();
        });
    }

    reload(doReload: boolean) {
        if (doReload) {
            this.noteId = undefined;
            this.getNotes();
        }
    }

    drop(event: CdkDragDrop<NoteModel[]>) {
        moveItemInArray(this.notes, event.previousIndex, event.currentIndex);
        this.notesService.updatePosition(this.notes).subscribe(_ => {});
    }

    private getNotes() {
        this.isLoading = true;
        this.notesService.getNotes(this.groupId).subscribe({
            next: (notes) => {
                this.notes = notes.sort((a,b) => a.position - b.position);
                this.isLoading = false;
            },
            error: (err) => {
                this.isLoading = false;
                console.error(err);
            }
        });
    }
}
