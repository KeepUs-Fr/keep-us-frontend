import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AvatarListComponent } from './avatar-list/avatar-list.component';
import { SideNavService } from '../../services/side-nav.service';
import {UserService} from "../../services/user.service";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    selectedAvatar = '';
    groups: any[] = [];
    displayedColumns = ['name', 'date', 'actions'];

    constructor(
        public authService: AuthService,
        private dialog: MatDialog,
        private sideNavService: SideNavService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        this.selectedAvatar = localStorage.getItem('avatar')!;
        this.sideNavService.avatarEmitted.subscribe((msg) => {
            this.selectedAvatar = msg;
        });

        this.userService.getGroupByUsername(localStorage.getItem('ownerId')!).subscribe({
            next: groups => {
                this.groups = groups;
            }
        });
    }

    openAvatarDialog(): void {
        this.dialog.open(AvatarListComponent, {
            maxWidth: '440px'
        });
    }
}
