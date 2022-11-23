import { Component } from '@angular/core';
import { CreateNoteModel } from '../../../models/note.model';
import { NotesService } from '../../../services/notes.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-note-creation',
    templateUrl: './note-creation.component.html',
    styleUrls: ['./note-creation.component.scss']
})
export class NoteCreationComponent {
    title = '';
    description = '';
    closeModal = false;
    isLocked = false;
    selectedColor = 'blue';

    constructor(
        private noteService: NotesService,
        private authService: AuthService
    ) {}

    onSubmit(): void {
        let newNote: CreateNoteModel = {
            title: this.title,
            content: this.description,
            position: 0,
            lock: this.isLocked,
            color: this.selectedColor,
            ownerId: this.authService.decodedToken.id,
            groupId: +localStorage.getItem('groupId')!
        };

        this.noteService.createNote(newNote).subscribe({
            next: (_) => {
                this.closeModal = true;
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    getColor(color: { key: string; value: string }) {
        this.selectedColor = color.key;
    }
}
