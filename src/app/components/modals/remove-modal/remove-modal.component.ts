import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: 'app-remove-modal',
    templateUrl: './remove-modal.component.html',
    styleUrls: ['./remove-modal.component.scss']
})
export class RemoveModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { isGroup: boolean }
    ) {}
}
