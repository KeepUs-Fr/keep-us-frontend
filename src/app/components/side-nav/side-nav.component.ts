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
import { RemoveModalComponent } from "../modals/remove-modal/remove-modal.component";
import { NotesService } from "../../services/notes.service";


@UntilDestroy()
@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
    groups: GroupModel[] = [];
    selectedGroup = {} as GroupModel;
    currentId = localStorage.getItem('groupId');
    avatarId = '1';

    @ViewChild('drawer') drawer!: MatSidenav;
    panelOpenState = true;

    isMobile$ = this.responsiveService.isMobile$;

    constructor(
        public authService: AuthService,
        private sideNavService: SideNavService,
        private router: Router,
        private dialog: MatDialog,
        private snackBarService: SnackBarService,
        private responsiveService: ResponsiveService,
        private userService: UserService,
        private notesService: NotesService
    ){
    }


    ngOnInit() {
        if (this.authService.isLogged()) {
            this.router.navigate(['notes']).then();
            this.getUserById();

            this.sideNavService.avatarEmitted.subscribe((msg) => {
                this.avatarId = msg;
            });

            this.authService.changeEmitted.subscribe(change => {
                if (change) this.getUserById();
            })

            this.userService.groupIdEmitted.subscribe(change => {
                if (change.id === 0) this.getGroupByUsername();
            });
        }
    }

    groupAction(id: number, group?: GroupModel) {
        if (group === undefined) {
            this.selectedGroup = {
                id: -1,
                name: 'Profile',
                ownerId: this.authService.decodedToken.id,
                members: [],
                createDate: new Date()
            };
        } else {
            this.selectedGroup = group;
        }

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

    getUserById() {
        this.userService.getUserById(this.authService.decodedToken?.id!).subscribe({
            next: user => {
               this.avatarId = user.avatarId.toString();
               this.getGroupByUsername();
            },
            error: err => {
                console.error(err);
            }
        })
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

    openRemoveDialog() {
        const dialogRef = this.dialog.open(RemoveModalComponent, {
            maxWidth: '400px',
            data: { isGroup: true, id: this.selectedGroup.id },
        });

        dialogRef.afterClosed().subscribe({
            next: isRemovable => {
                if (isRemovable) this.userService.deleteGroup(this.selectedGroup.id).subscribe({
                    next: _ => {
                        this.getGroupByUsername();
                        this.snackBarService.openSuccess('Le groupe a été supprimé');
                    },
                    error: err => console.error(err)
                });
            },
            error: err => console.error(err)
        });
    }

    private getGroupByUsername() {
        this.userService.getGroupsByOwnerId(this.authService.decodedToken.id).subscribe({
            next: (groups) => {
                this.groups = groups;
                this.selectedGroup = this.groups.slice(0, 1).shift()!;
                this.currentId = this.selectedGroup.id.toString();
                localStorage.setItem('groupId', this.currentId);
                const change = {id: +this.currentId, clearNoteId: true};
                this.userService.emitGroupId(change);
            }
        });
    }
}
