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
    groups: any[] = [];
    selectedGroup = '';
    selectedAvatar = '';

    constructor(
        private breakpointObserver: BreakpointObserver,
        public authService: AuthService,
        private sideNavService: SideNavService,
        private userService: UserService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.isLogged = this.authService.isLogged();
        if (this.isLogged) {
            this.getGroupByUsername();

            /*
             * Subscribe to avatar observable to get selected avatar
             */
            this.sideNavService.avatarEmitted.subscribe((msg) => {
                this.selectedAvatar = msg;
            });

            this.getAvatar();
        }

        this.authService.changeEmitted.subscribe((value) => {
            this.isLogged = value;
            if (value) {
                this.getGroupByUsername();
            }
        });
    }

    groupAction(groupName: string, id: number): void {
        this.selectedGroup = groupName;
        if (id !== 0) {
            localStorage.setItem('groupId', id.toString());
            this.router.navigate(['notes']).then((_) => {
                this.userService.emitGroupId(id);
            });
        }
    }

    getAvatar(): void {
        const avatar = localStorage.getItem('avatar');
        if (!avatar) {
            localStorage.setItem('avatar', '1');
            this.selectedAvatar = '1';
        } else {
            this.selectedAvatar = avatar;
        }
    }

    openCreationGroupDialog(): void {
        const dialogRef = this.dialog.open(AddGroupComponent);

        dialogRef.afterClosed().subscribe({
            next: (_) => {
                this.getGroupByUsername();
            },
            error: (err) => {
                console.error(err);
            }
        });
    }

    private getGroupByUsername(): void {
        this.userService.getGroupByUsername('1').subscribe({
            next: (groups) => {
                this.groups = groups;
                const currentGroup = this.groups.slice(0, 1).shift();
                this.selectedGroup = currentGroup.name;
                this.userService.emitGroupId(currentGroup.id);
                localStorage.setItem('groupId', currentGroup.id);
                localStorage.setItem('ownerId', '1');
            }
        });
    }
}
