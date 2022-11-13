import { Component, OnInit } from '@angular/core';
import { CreateNoteModel } from '../../../models/note.model';
import { NotesService } from '../../../services/notes.service';

@Component({
    selector: 'app-note-creation',
    templateUrl: './note-creation.component.html',
    styleUrls: ['./note-creation.component.scss']
})
export class NoteCreationComponent implements OnInit {
    title = '';
    description = '';
    closeModal = false;
    selectedColor = 'blue';

    constructor(private noteService: NotesService) {}

    ngOnInit(): void {}

    submit(): void {
        let newNote: CreateNoteModel = {
            title: this.title,
            content: this.description,
            position: 0,
            isLock: true,
            color: this.selectedColor,
            ownerId: +localStorage.getItem('ownerId')!,
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
