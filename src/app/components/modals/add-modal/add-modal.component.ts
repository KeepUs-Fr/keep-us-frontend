import { Component, Inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateGroupModel } from '../../../models/group.model';
import { AuthService } from '../../../services/auth.service';
import { SnackBarService } from '../../../services/snack-bar.service';

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
        private snackBarService: SnackBarService,
        @Inject(MAT_DIALOG_DATA)
        public data: { isCreation: boolean }
    ) {}

    onSubmit() {
        if (this.data.isCreation) {
            const group: CreateGroupModel = {
                name: this.name,
                ownerId: this.authService.decodedToken.id,
                members: []
            };
            this.userService.createGroup(group).subscribe({
                next: _ => this.snackBarService.openSuccess('Le groupe a été créé'),
                error: (err) => console.error(err)
            });
        } else {
            this.userService.addGroupMember(+localStorage.getItem('groupId')!, this.name).subscribe({
                next: _ => this.snackBarService.openSuccess(this.name + ' a été ajouté'),
                error: err => {
                    console.error(err);

                    if (err.status === 404)
                        this.snackBarService.openError('L\'utilisateur ' + this.name + ' est introuvable');

                    if (err.status === 409)
                        this.snackBarService.openError('L\'utilisateur ' + this.name + ' est déjà dans le groupe');
                }
            });
        }
    }
}
