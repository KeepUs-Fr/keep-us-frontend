import { Component, Inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateGroupModel } from '../../../models/group.model';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-add-modal',
    templateUrl: './add-modal.component.html',
    styleUrls: ['./add-modal.component.scss']
})
export class AddModalComponent {
    name: string = '';

    constructor(
        private userService: UserService,
        private authService: AuthService,
        @Inject(MAT_DIALOG_DATA)
        public data: { isCreation: boolean }
    ) {}

    submit() {
        if (this.data.isCreation) {
            const group: CreateGroupModel = {
                name: this.name,
                ownerId: this.authService.decodedToken.id,
                members: []
            };

            this.userService.createGroup(group).subscribe((_) => {});
        }
    }
}
