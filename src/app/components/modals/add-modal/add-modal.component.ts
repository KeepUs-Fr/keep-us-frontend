import { Component, Inject, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-add-modal',
    templateUrl: './add-modal.component.html',
    styleUrls: ['./add-modal.component.scss']
})
export class AddModalComponent {
    name: string = '';

    constructor(
        private userService: UserService,
        @Inject(MAT_DIALOG_DATA)
        public data: { isCreation: boolean }
    ) {}

    submit() {
        if (this.data.isCreation)
            this.userService.createGroup(this.name.trim()).subscribe((_) => {});
    }
}
