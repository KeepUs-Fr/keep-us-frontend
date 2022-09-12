import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AvatarListComponent } from './avatar-list/avatar-list.component';
import { SideNavService } from '../../services/side-nav.service';
import { UserService } from '../../services/user.service';
import { RemoveModalComponent } from '../modals/remove-modal/remove-modal.component';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { NotesService } from '../../services/notes.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    selectedAvatar = '';
    groups: any[] = [];
    displayedColumns = ['name', 'date', 'actions'];
    ownerId = 0;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        public authService: AuthService,
        private dialog: MatDialog,
        private sideNavService: SideNavService,
        private userService: UserService,
        private _snackBar: MatSnackBar,
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
            maxWidth: '440px'
        });

        dialogRef.afterClosed().subscribe({
            next: (isRemovable) => {
                if (isRemovable) {
                    this.notesService
                        .deleteAllNote(groupId)
                        .subscribe((_) => {});
                    this.userService.deleteGroup(groupId).subscribe({
                        next: (_) => {
                            this.userService.emitGroupId(0);
                            this.getGroups();
                            this.openSnackBar('Group have been deleted');
                        }
                    });
                }
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    private getGroups(): void {
        this.userService
            .getGroupByOwnerId(+localStorage.getItem('ownerId')!)
            .subscribe({
                next: (groups) => {
                    this.groups = groups;
                }
            });
    }

    private openSnackBar(msg: string) {
        this._snackBar.open(msg, 'Close', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 1500
        });
    }
}
