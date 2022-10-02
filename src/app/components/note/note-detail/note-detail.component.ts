import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { CreateNoteModel, NoteModel } from '../../../models/note.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotesService } from '../../../services/notes.service';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RemoveModalComponent } from '../../modals/remove-modal/remove-modal.component';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-note-detail',
    templateUrl: './note-detail.component.html',
    styleUrls: ['./note-detail.component.scss']
})
export class NoteDetailComponent implements OnInit {
    @Input() noteId = -1;

    currentId = -1;
    note: NoteModel | undefined;
    title: string = '';
    description: string = '';
    selectedColor: { key: string; value: string } = { key: '', value: '' };

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        private route: ActivatedRoute,
        private notesService: NotesService,
        private router: Router,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        if(this.noteId === -1) {
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
        console.log(changes);
    }

    getNoteDetail(): void {
        this.notesService.getNoteById(this.currentId).subscribe({
            next: (note) => {
                this.note = note;
                this.title = this.note.title;
                this.description = this.note.description;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    updateNote(): void {
        if (
            this.note?.title === this.title &&
            this.note.description === this.description &&
            this.note.color === this.selectedColor.value
        ) {
            this.router.navigate(['notes']).then((_) => {
                this.userService.emitGroupId(this.note?.groupId!);
            });
        } else {
            const newNote: CreateNoteModel = {
                title: this.title,
                description: this.description,
                tag: this.note?.tag!,
                color: this.selectedColor.key,
                ownerId: this.note?.ownerId!,
                groupId: this.note?.groupId!
            };

            this.notesService.updateNote(this.currentId, newNote).subscribe({
                next: (_) => {
                    this.router.navigate(['notes']).then();
                    this.openSnackBar('Note updated');
                },
                error: (err) => {
                    console.error(err);
                }
            });
        }
    }

    getColor(color: { key: string; value: string }): void {
        this.selectedColor = color;
    }

    openRemoveDialog(): void {
        const dialogRef = this.dialog.open(RemoveModalComponent, {
            maxWidth: '440px'
        });

        dialogRef.afterClosed().subscribe({
            next: (isRemovable) => {
                if (isRemovable) {
                    this.notesService.deleteNote(this.currentId).subscribe({
                        next: (_) => {
                            this.router.navigate(['notes']).then();
                            this.openSnackBar('Note removed successfully');
                        }
                    });
                }
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    private openSnackBar(msg: string) {
        this._snackBar.open(msg, 'Close', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 1500
        });
    }
}
