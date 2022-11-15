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
    ownerId = 0;

    constructor(
        public authService: AuthService,
        private dialog: MatDialog,
        private sideNavService: SideNavService,
        private userService: UserService,
        private snackBarService: SnackBarService,
        private notesService: NotesService
    ) {}

    ngOnInit(): void {
        const avatar = localStorage.getItem('avatar');
        this.selectedAvatar = avatar ? avatar : '1';

        this.ownerId = +localStorage.getItem('ownerId')!;

        this.sideNavService.avatarEmitted.subscribe((msg) => {
            this.selectedAvatar = msg;
        });

        this.getGroups();
    }

    openAvatarDialog(): void {
        this.dialog.open(AvatarListComponent, {
            maxWidth: '440px'
        });
    }

    openRemoveDialog(groupId: number): void {
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
        this.userService.getGroupsByOwnerId(+localStorage.getItem('ownerId')!).subscribe({
            next: (groups) => {
                this.groups = groups;
            }
        });
    }
}
