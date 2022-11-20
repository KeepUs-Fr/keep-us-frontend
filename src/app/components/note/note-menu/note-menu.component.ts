import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NoteModel } from "../../../models/note.model";
import { RemoveModalComponent } from "../../modals/remove-modal/remove-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { NotesService } from "../../../services/notes.service";

@Component({
  selector: 'app-note-menu',
  templateUrl: './note-menu.component.html',
  styleUrls: ['./note-menu.component.scss']
})
export class NoteMenuComponent {
    @Input() note = {} as NoteModel;
    @Output() reload = new EventEmitter<boolean>();

    constructor(private dialog: MatDialog,
                private notesService: NotesService
             ) {}

    openRemoveDialog() {
        const dialogRef = this.dialog.open(RemoveModalComponent, {
            width: '400px',
            data: { isGroup: false, id: this.note.id },
        });

        dialogRef.afterClosed().subscribe({
            next: reload => {
                if (reload) this.reload.emit(true);
            },
            error: err => console.error(err)
        });
    }

    lockOrUnlock() {
        this.note.lock = !this.note.lock;
        this.notesService.lockUnlockNote(this.note.id).subscribe({
            next: note => this.note = note,
            error: err => console.error(err)
        });
    }
}
