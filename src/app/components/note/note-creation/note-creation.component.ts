import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import {CreateNoteModel} from "../../../models/note.model";
import {NotesService} from "../../../services/notes.service";

@Component({
    selector: 'app-note-creation',
    templateUrl: './note-creation.component.html',
    styleUrls: ['./note-creation.component.scss']
})
export class NoteCreationComponent implements OnInit {
    @Output() mode = new EventEmitter<boolean>();
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;
    tags: string[] = [];
    colors = new Map<string, string>();
    selectedColor = 'black';
    title = '';
    description = '';

    constructor(private noteService: NotesService) {}

    ngOnInit(): void {
        this.colors
            .set('black', '#424242')
            .set('red', '#5c2b29')
            .set('orange', '#614a19')
            .set('yellow', '#635d19')
            .set('green', '#345920')
            .set('cyan', '#2d555e')
            .set('blue', '#1e3a5f')
            .set('purple', '#42275e')
            .set('pink', '#5b2245')
            .set('brown', '#442f19');
    }

    submit(): void {
        let newNote: CreateNoteModel = {
            title: this.title,
            description: this.description,
            tag: this.tags[0],
            color: this.selectedColor
        }
        console.log(newNote);
        this.noteService.createNote(newNote).subscribe({
            next: note => {
                this.cancel();
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    cancel(): void {
        this.mode.emit(false);
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

    getCurrentColor(color: string): void {
        this.selectedColor = color;
    }
}
