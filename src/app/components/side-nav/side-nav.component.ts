import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';
import {SideNavService} from '../../services/side-nav.service';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AddModalComponent} from '../modals/add-modal/add-modal.component';
import {SnackBarService} from "../../services/snack-bar.service";
import {DeviceDetectorService} from "ngx-device-detector";
import {UserModalComponent} from "../modals/user-modal/user-modal.component";
import {GroupModel} from "../../models/group.model";

@Component({
    selector: 'app-side-nav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
    isHandset$: Observable<boolean> = this.breakpointObserver
        .observe(Breakpoints.Handset)
        .pipe(
            map((result) => result.matches),
            shareReplay()
        );

    isLogged = false;
    groups: GroupModel[] = [];
    selectedGroup = new GroupModel();
    selectedAvatar = '1';
    panelOpenState = true;
    isMobile = false;
    currentId = localStorage.getItem('groupId');

    constructor(
        private breakpointObserver: BreakpointObserver,
        public authService: AuthService,
        private sideNavService: SideNavService,
        private userService: UserService,
        private router: Router,
        private dialog: MatDialog,
        private snackBarService: SnackBarService,
        private deviceService: DeviceDetectorService
    ) {}

    ngOnInit() {
        this.isLogged = this.authService.isLogged();
        this.isMobile = this.deviceService.isMobile();
        if (this.isLogged) {
            this.getGroupByUsername();
            this.getAvatar();

            /*
             * Subscribe to avatar observable to get selected avatar
             */
            this.sideNavService.avatarEmitted.subscribe((msg) => {
                this.selectedAvatar = msg;
            });
        }

        this.authService.changeEmitted.subscribe((value) => {
            this.isLogged = value;
            if (this.isLogged) {
                this.getGroupByUsername();
            }
        });

        this.userService.groupIdEmitted.subscribe(value => {
            if (value === 0)
                this.getGroupByUsername();
        });
    }

     groupAction(id: number, group?: GroupModel) {
        if (group !== undefined)
            this.selectedGroup = group;

        localStorage.setItem('groupId', id.toString());
        this.currentId = id.toString();

        if (group && id > 0) {
            this.router.navigate(['notes']).then();
            this.userService.emitGroupId(id);
        }
    }

    getAvatar(): void {
        const avatar = localStorage.getItem('avatar');
        this.selectedAvatar = avatar ? avatar : '1';
    }

    openAddModal(isCreation: boolean): void {
        const dialogRef = this.dialog.open(AddModalComponent, {
            data: { isCreation: isCreation }
        });

        dialogRef.afterClosed().subscribe({
            next: (username) => {
                if (isCreation) {
                    if (username !== false) {
                        this.getGroupByUsername();
                        this.snackBarService.openSuccess('Group successfully created');
                    }
                } else {
                    if (username !== false) {
                        this.userService.getUserByUsername(username).subscribe({
                            next: (user) => {
                                console.log(user);
                                this.userService.addGroupMember(
                                    +localStorage.getItem('groupId')!, user.id)
                                    .subscribe(_ => this.snackBarService.openSuccess(
                                        'User ' + user.username + ' has been added')
                                    );
                            },
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

    openUserModal() {
        const groupId = localStorage.getItem('groupId');
        const id = groupId !== null ? +groupId : -1;

        const group = this.groups.filter(g => g.id === id)[0];
        console.log(group)
        this.dialog.open(UserModalComponent);
    }

    private getGroupByUsername() {
        this.userService
            .getGroupByOwnerId(+localStorage.getItem('ownerId')!)
            .subscribe({
                next: (groups) => {
                    this.groups = groups;
                    const firstGroup = this.groups.slice(0, 1).shift();
                    if(firstGroup)
                        this.selectedGroup = firstGroup;
                        this.userService.emitGroupId( this.selectedGroup.id);
                        localStorage.setItem('groupId',  this.selectedGroup.id.toString());
                }
            });
    }
}
