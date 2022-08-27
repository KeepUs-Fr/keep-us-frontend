import {Component, OnInit} from '@angular/core';
import {CreateNoteModel, NoteModel} from "../../../models/note.model";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NotesService} from "../../../services/notes.service";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

@Component({
    selector: 'app-note-detail',
    templateUrl: './note-detail.component.html',
    styleUrls: ['./note-detail.component.scss']
})
export class NoteDetailComponent implements OnInit {
    currentId = -1;
    note: NoteModel | undefined;
    title: string = '';
    description: string = '';
    selectedColor: string = 'black';

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(private route: ActivatedRoute,
                private notesService: NotesService,
                private router: Router,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.currentId = params['id'];
            this.getNoteDetail();

        });
    }

    getNoteDetail(): void {
        this.notesService.getNoteById(this.currentId).subscribe({
            next: (note) => {
                this.note = note;
                this.title = this.note.title;
                this.description = this.note.description;
                this.selectedColor = this.note.color;
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    updateNote(): void {
        if(this.note?.title === this.title
            && this.note.description === this.description
            && this.note.color === this.selectedColor
        ) {
            this.router.navigate(['notes']).then();
        } else {
            const newNote: CreateNoteModel = {
                title: this.title,
                description: this.description,
                tag: this.note?.tag!,
                color: this.selectedColor
            }

            this.notesService.updateNote(this.currentId, newNote).subscribe({
                next: _ => {
                    this.router.navigate(['notes']).then();
                    this.openSnackBar('Note updated');
                },
                error: (err) => {
                    console.error(err);
                }
            });
        }
    }

    removeNote(): void {
        this.notesService.removeNote(this.currentId).subscribe({
            next: _ => {
                this.router.navigate(['notes']).then();
                this.openSnackBar('Note removed successfully');
            }
        });
    }

    getColor(color: string) {
        this.selectedColor = color;
    }

    private openSnackBar(msg: string) {
        this._snackBar.open(msg, 'Close', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 1500,
        });
    }
}
