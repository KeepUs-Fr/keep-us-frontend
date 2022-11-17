import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AvatarListComponent } from './avatar-list/avatar-list.component';
import { SideNavService } from '../../services/side-nav.service';
import { UserService } from '../../services/user.service';
import { RemoveModalComponent } from '../modals/remove-modal/remove-modal.component';
import { NotesService } from '../../services/notes.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { GroupModel } from "../../models/group.model";


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    selectedAvatar = '';
    groups: GroupModel[] = [];
    displayedColumns = ['name', 'date', 'members', 'actions'];

    constructor(
        public authService: AuthService,
        private dialog: MatDialog,
        private sideNavService: SideNavService,
        private snackBarService: SnackBarService,
        private notesService: NotesService,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.getGroups();
        this.getAvatar();
    }

    openAvatarDialog(): void {
        const dialogRef = this.dialog.open(AvatarListComponent, {
            maxWidth: '440px'
        });
        dialogRef.afterClosed().subscribe({
            next: (avatarId) => {
                if (this.selectedAvatar !== avatarId)
                    this.userService.updateAvatar(this.authService.decodedToken.id, avatarId)
                        .subscribe(user => this.selectedAvatar = user.avatarId.toString());
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    openRemoveDialog(groupId: number) {
        const dialogRef = this.dialog.open(RemoveModalComponent, {
            maxWidth: '440px',
            data: { isGroup: true },
        });

        dialogRef.afterClosed().subscribe({
            next: (isRemovable) => {
                if (isRemovable) {
                    this.notesService
                        .deleteAllNote(groupId)
                        .subscribe((_) => {});
                    this.userService.deleteGroup(groupId).subscribe({
                        next: (_) => {
                            const change = {id: 0, clearNoteId: false};
                            this.userService.emitGroupId(change);
                            this.getGroups();
                            this.snackBarService.openSuccess(
                                'Le groupe a été supprimé'
                            );
                        }
                    });
                }
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    private getGroups() {
        this.userService.getGroupsByOwnerId(this.authService.decodedToken.id).subscribe({
            next: (groups) => {
                this.groups = groups;
            }
        });
    }

    private getAvatar() {
        this.userService.getUserById(this.authService.decodedToken.id).subscribe({
            next: (user) => {
                this.selectedAvatar = user.avatarId.toString();
            }
        });
    }
}
