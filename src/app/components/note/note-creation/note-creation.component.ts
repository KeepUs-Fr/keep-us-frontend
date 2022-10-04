import {Component, OnInit} from '@angular/core';
import {MatChipInputEvent} from '@angular/material/chips';
import {CreateNoteModel} from '../../../models/note.model';
import {NotesService} from '../../../services/notes.service';

@Component({
    selector: 'app-note-creation',
    templateUrl: './note-creation.component.html',
    styleUrls: ['./note-creation.component.scss']
})
export class NoteCreationComponent implements OnInit {
    tags: string[] = [];
    title = '';
    description = '';
    closeModal = false;
    selectedColor = 'black';

    constructor(private noteService: NotesService) {}

    ngOnInit(): void {}

    submit(): void {
        let newNote: CreateNoteModel = {
            title: this.title,
            content: this.description,
            tag: this.tags[0],
            color: this.selectedColor,
            ownerId: +localStorage.getItem('ownerId')!,
            groupId: +localStorage.getItem('groupId')!
        };

        this.noteService.createNote(newNote).subscribe({
            next: _ => {
                this.closeModal = true;
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add our tags
        if (value) {
            this.tags.push(value);
        }
        event.chipInput!.clear();
    }

    remove(fruit: string): void {
        const index = this.tags.indexOf(fruit);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    getColor(color: { key: string; value: string }) {
        this.selectedColor = color.key;
    }
}
