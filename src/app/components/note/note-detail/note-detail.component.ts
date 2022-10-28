import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { CreateNoteModel, NoteModel } from '../../../models/note.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotesService } from '../../../services/notes.service';
import {
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RemoveModalComponent } from '../../modals/remove-modal/remove-modal.component';
import { UserService } from '../../../services/user.service';
import { SnackBarService } from '../../../services/snack-bar.service';

@Component({
    selector: 'app-note-detail',
    templateUrl: './note-detail.component.html',
    styleUrls: ['./note-detail.component.scss']
})
export class NoteDetailComponent implements OnInit {
    @Input() noteId = -1;
    @Output() reload = new EventEmitter<boolean>();

    currentId = -1;
    note: NoteModel | undefined;
    title: string = '';
    content: string = '';
    selectedColor: { key: string; value: string } = { key: '', value: '' };

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        private route: ActivatedRoute,
        private notesService: NotesService,
        private router: Router,
        private dialog: MatDialog,
        private snackBarService: SnackBarService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
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
        if (this.currentId > 0 && this.currentId !== undefined)
            this.notesService.getNoteById(this.currentId).subscribe({
                next: (note) => {
                    this.note = note;
                    this.title = this.note.title;
                    this.content = this.note.content;
                    this.selectedColor.value = this.note.color;
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }

    updateNote() {
        if (this.note?.title === this.title && this.note.content === this.content)
            return;

        const noteColor = this.getColorFromHex(this.note?.color!);

        const newNote: CreateNoteModel = {
            title: this.title,
            content: this.content,
            color: noteColor,
            ownerId: this.note?.ownerId!,
            groupId: this.note?.groupId!
        };

        this.notesService.updateNote(this.currentId, newNote).subscribe({
            next: (_) => {
                this.userService.emitGroupId(
                    +localStorage.getItem('groupId')!
                );
                this.snackBarService.openSuccess('Note updated');
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    getColor(color: { key: string; value: string }): void {
        this.selectedColor = color;
    }

    openRemoveDialog() {
        const dialogRef = this.dialog.open(RemoveModalComponent, {
            width: '600px'
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
                                'Note removed successfully'
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

    private getColorFromHex(hex: string): string {
        switch (hex) {
            case '#FF6262':
                return 'red';
            case  '#22A991':
                return 'green';
            case '#F98A5A':
                return 'orange';
            case '#B28BB9':
                return 'purple';
            default:
                return 'blue';
        }
    }
}
