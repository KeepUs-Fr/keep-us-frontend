import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { SideNavService } from '../../services/side-nav.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupComponent } from './add-group/add-group.component';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

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
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    isLogged = false;
    groups: any[] = [];
    selectedGroup = '';
    selectedAvatar = '1';

    constructor(
        private breakpointObserver: BreakpointObserver,
        public authService: AuthService,
        private sideNavService: SideNavService,
        private userService: UserService,
        private router: Router,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.isLogged = this.authService.isLogged();
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

        this.authService.changeEmitted.subscribe(value => {
            this.isLogged = value;
            if (value) {
                return this.getGroupByUsername();
            }
        });

        this.userService.groupIdEmitted.subscribe(value => {
            if (value === 0)
                return this.getGroupByUsername();
        })
    }

    groupAction(groupName: string, id: number): void {
        this.selectedGroup = groupName;
        if (id !== 0) {
            localStorage.setItem('groupId', id.toString());
            this.router.navigate(['notes']).then( _ => {
                this.userService.emitGroupId(id);
            });
        }
    }

    getAvatar(): void {
        const avatar = localStorage.getItem('avatar');
        this.selectedAvatar = avatar ? avatar : '1';
    }

    openCreationGroupDialog(): void {
        const dialogRef = this.dialog.open(AddGroupComponent);

        dialogRef.afterClosed().subscribe({
            next: _ => {
                this.getGroupByUsername();
                this.openSnackBar('Group successfully created');
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    private getGroupByUsername(): void {
        this.userService.getGroupByOwnerId(+localStorage.getItem('ownerId')!).subscribe({
            next: (groups) => {
                this.groups = groups;
                const currentGroup = this.groups.slice(0, 1).shift();
                this.selectedGroup = currentGroup.name;
                this.userService.emitGroupId(currentGroup.id);
                localStorage.setItem('groupId', currentGroup.id);
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
