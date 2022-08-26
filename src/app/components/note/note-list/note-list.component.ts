import { Component, OnInit } from '@angular/core';
import {NotesService} from "../../../services/notes.service";
import {NoteModel} from "../../../models/note.model";

@Component({
    selector: 'app-note-list',
    templateUrl: './note-list.component.html',
    styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
    /**
     * Number of notes on grid line
     */
    valueCols: number = 1;
    isCreationMode = false;
    notes: NoteModel[] = []

    constructor(private notesService: NotesService) {}

    ngOnInit(): void {
        this.breakPoints();
        this.getNotes();
    }

    breakPoints(): void {
        switch (true) {
            case window.innerWidth <= 730:
                this.valueCols = 1;
                break;
            case window.innerWidth > 730 && window.innerWidth <= 1020:
                this.valueCols = 2;
                break;
            case window.innerWidth > 1020 && window.innerWidth <= 1200:
                this.valueCols = 3;
                break;
            default:
                this.valueCols = 4;
        }
    }

    getMode(mode: boolean): void {
        this.isCreationMode = mode;
        this.getNotes();
    }

    getNotes(): void {
        this.notesService.getNotes().subscribe({
            next: notes => {
                this.notes = notes;
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    remove(id: number): void {
        this.notesService.removeNote(id).subscribe({
            next: _ => {
                this.getNotes();
            }
        });
    }
}
