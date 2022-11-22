import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotesService } from '../../../services/notes.service';

@Component({
    selector: 'app-remove-modal',
    templateUrl: './remove-modal.component.html',
    styleUrls: ['./remove-modal.component.scss']
})
export class RemoveModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { isGroup: boolean; id: number },
        private notesService: NotesService
    ) {}

    onSubmit() {
        if (this.data.isGroup) {
            this.notesService.deleteAllNote(this.data.id).subscribe({
                next: (_) => {},
                error: (err) => console.error(err)
            });
        } else {
            this.notesService.deleteNote(this.data.id).subscribe({
                next: (_) => {},
                error: (err) => console.error(err)
            });
        }
    }
}
