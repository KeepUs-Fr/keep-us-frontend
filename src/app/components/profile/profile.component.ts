import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AvatarListComponent } from './avatar-list/avatar-list.component';
import { SideNavService } from '../../services/side-nav.service';
import { UserService } from '../../services/user.service';
import { NotesService } from '../../services/notes.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { UserModel } from '../../models/user.model';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    displayedColumns = ['name', 'date', 'members', 'actions'];
    selectedAvatar = '';
    user = {} as UserModel;

    constructor(
        public authService: AuthService,
        private dialog: MatDialog,
        private sideNavService: SideNavService,
        private snackBarService: SnackBarService,
        private notesService: NotesService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.getAvatar();
    }

    openAvatarDialog(): void {
        const dialogRef = this.dialog.open(AvatarListComponent, {
            maxWidth: '440px'
        });

        dialogRef.afterClosed().subscribe({
            next: (avatarId) => {
                if (this.user.avatarId !== avatarId)
                    this.userService
                        .updateAvatar(
                            this.authService.decodedToken.id,
                            avatarId
                        )
                        .subscribe((user) => (this.user = user));
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    private getAvatar() {
        this.userService
            .getUserById(this.authService.decodedToken.id)
            .subscribe((user) => (this.user = user));
    }
}
