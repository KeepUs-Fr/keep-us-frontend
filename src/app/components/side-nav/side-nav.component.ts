import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SideNavService } from '../../services/side-nav.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddModalComponent } from '../modals/add-modal/add-modal.component';
import { SnackBarService } from '../../services/snack-bar.service';
import { GroupModel } from '../../models/group.model';
import { ResponsiveService } from '../../services/responsive.service';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
    groups: GroupModel[] = [];
    selectedGroup = {} as GroupModel;
    selectedAvatar = '1';
    panelOpenState = true;
    currentId = localStorage.getItem('groupId');

    @ViewChild('drawer') drawer!: MatSidenav;

    isMobile$ = this.responsiveService.isMobile$;

    constructor(
        public authService: AuthService,
        private sideNavService: SideNavService,
        private userService: UserService,
        private router: Router,
        private dialog: MatDialog,
        private snackBarService: SnackBarService,
        private responsiveService: ResponsiveService
    ) {}

    ngOnInit() {
        if (this.authService.isLogged()) {
            this.getAvatar();
            this.getGroupByUsername();

            this.sideNavService.avatarEmitted.subscribe((msg) => {
                this.selectedAvatar = msg;
            });

            this.authService.changeEmitted.subscribe(change => {
                if (change) this.getGroupByUsername();
            })

            this.userService.groupIdEmitted.subscribe(change => {
                if (change.id === 0) this.getGroupByUsername();
            });
        }
    }

    groupAction(id: number, group?: GroupModel) {
        if (group !== undefined) this.selectedGroup = group;

        localStorage.setItem('groupId', id.toString());
        this.currentId = id.toString();

        if (group && id > 0) {
            this.router.navigate(['notes']).then();
            const change = {id: id, clearNoteId: true};
            this.userService.emitGroupId(change);
        }

        this.isMobile$.pipe(untilDestroyed(this)).subscribe((result) => {
            if (result) this.drawer.close().then();
        });
    }

    getAvatar() {
        const avatar = localStorage.getItem('avatarId');
        this.selectedAvatar = avatar ? avatar : '1';
    }

    openAddModal(isCreation: boolean): void {
        const dialogRef = this.dialog.open(AddModalComponent, {
            data: { isCreation: isCreation },
            width: '400px'
        });

        dialogRef.afterClosed().subscribe({
            next: (username) => {
                if (isCreation) {
                    if (username !== false) {
                        this.getGroupByUsername();
                        this.snackBarService.openSuccess(
                            'Le groupe a été créé'
                        );
                    }
                } else {
                    if (username !== false) {
                        this.userService.addGroupMember(
                            +localStorage.getItem('groupId')!, username).subscribe({
                            next: _ => this.snackBarService.openSuccess('User ' + username + ' has been added'),
                            error: (err) => {
                                this.snackBarService.openError(err.error.message);
                            }
                        });
                    }
                }
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    private getGroupByUsername() {
        this.userService.getGroupsByOwnerId(+localStorage.getItem('ownerId')!).subscribe({
            next: (groups) => {
                this.groups = groups;
                if (this.currentId && this.currentId !== '-1' && this.currentId !== '0') {
                    this.userService.getGroupById(+this.currentId).subscribe((group) => {
                        this.selectedGroup = group;
                    });
                } else {
                    this.selectedGroup = this.groups.slice(0, 1).shift()!;
                }
            }
        });
    }
}
