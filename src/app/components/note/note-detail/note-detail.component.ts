import {
    Component,
    EventEmitter,
    Input, OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { CreateNoteModel, NoteModel } from '../../../models/note.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotesService } from '../../../services/notes.service';
import { MatDialog } from '@angular/material/dialog';
import { RemoveModalComponent } from '../../modals/remove-modal/remove-modal.component';
import { SnackBarService } from '../../../services/snack-bar.service';
import { UserService } from "../../../services/user.service";
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: 'app-note-detail',
    templateUrl: './note-detail.component.html',
    styleUrls: ['./note-detail.component.scss']
})
export class NoteDetailComponent implements OnInit, OnChanges {
    @Input() noteId = -1;
    @Output() reload = new EventEmitter<boolean>();

    currentId = -1;
    note = {} as NoteModel;
    title: string = '';
    content: string = '';
    selectedColor = { key: '', value: '' };
    isLocked = false;
    userId = 0;

    constructor(
        private route: ActivatedRoute,
        private notesService: NotesService,
        private router: Router,
        private dialog: MatDialog,
        private snackBarService: SnackBarService,
        private userService: UserService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.userId = this.authService.decodedToken?.id!;

        if (this.noteId === -1) {
            this.route.params.subscribe((params: Params) => {
                this.currentId = params['id'];
                this.getNoteDetail();
            });
        } else {
            this.currentId = this.noteId;
            this.getNoteDetail();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        this.currentId = this.noteId;
        this.getNoteDetail();
    }

    getNoteDetail() {
        this.notesService.getNoteById(this.currentId).subscribe({
            next: (note) => {
                console.log(note)
                this.note = note;
                this.title = this.note.title;
                this.content = this.note.content;
                this.selectedColor.value = this.note.color;
                this.isLocked = this.note.lock;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    updateNote() {
        if (
            this.note.title === this.title &&
            this.note.content === this.content &&
            this.note.color === this.selectedColor.value &&
            this.note.lock === this.isLocked
        ) return;

        this.note.title = this.title;
        this.note.content = this.content;
        this.note.lock = this.isLocked;
        this.note.color = this.selectedColor.key;

        this.notesService.updateNote(this.note).subscribe({
            next: (note) => {
                this.note = note;
                if (this.noteId !== -1) {
                    const change = {id: +localStorage.getItem('groupId')!, clearNoteId: false};
                    this.userService.emitGroupId(change);
                }
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    openRemoveDialog() {
        const dialogRef = this.dialog.open(RemoveModalComponent, {
            width: '400px',
            data: { isGroup: false },
        });

        dialogRef.afterClosed().subscribe({
            next: (isRemovable) => {
                if (isRemovable) {
                    this.notesService.deleteNote(this.currentId).subscribe({
                        next: (_) => {
                            if (this.noteId === -1) {
                                this.router.navigate(['notes']).then();
                            } else {
                                this.reload.emit(true);
                            }
                            this.snackBarService.openSuccess(
                                'La note a été supprimée'
                            );
                        }
                    });
                }
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    getCurrentColor(color: {key: string, value: string}) {
        this.selectedColor = color;
        this.updateNote();
    }
}
