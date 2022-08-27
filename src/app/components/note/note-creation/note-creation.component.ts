import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { CreateNoteModel } from '../../../models/note.model';
import { NotesService } from '../../../services/notes.service';

@Component({
    selector: 'app-note-creation',
    templateUrl: './note-creation.component.html',
    styleUrls: ['./note-creation.component.scss']
})
export class NoteCreationComponent implements OnInit {
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    tags: string[] = [];
    title = '';
    description = '';
    closeModal = false;
    selectedColor = 'black';

    constructor(private noteService: NotesService) {}

    ngOnInit(): void {
    }

    submit(): void {
        let newNote: CreateNoteModel = {
            title: this.title,
            description: this.description,
            tag: this.tags[0],
            color: this.selectedColor
        };

        this.noteService.createNote(newNote).subscribe({
            next: (note) => {
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

    getColor(color: string) {
        this.selectedColor = color;
    }

}
