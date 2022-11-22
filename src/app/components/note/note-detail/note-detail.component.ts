import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { NoteModel } from '../../../models/note.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotesService } from '../../../services/notes.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../../services/snack-bar.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

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

    constructor(
        public router: Router,
        public authService: AuthService,
        private route: ActivatedRoute,
        private notesService: NotesService,
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
        this.notesService.getNoteById(this.currentId).subscribe({
            next: (note) => {
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
        )
            return;

        this.note.title = this.title;
        this.note.content = this.content;
        this.note.lock = this.isLocked;
        this.note.color = this.selectedColor.key;

        this.notesService.updateNote(this.note).subscribe({
            next: (note) => {
                this.note = note;
                const change = {
                    id: +localStorage.getItem('groupId')!,
                    clearNoteId: false
                };
                this.userService.emitGroupId(change);
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    getCurrentColor(color: { key: string; value: string }) {
        this.selectedColor = color;
        this.updateNote();
    }
}
