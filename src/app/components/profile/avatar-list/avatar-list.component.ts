import { Component, OnInit } from '@angular/core';
import { SideNavService } from '../../../services/side-nav.service';

@Component({
    selector: 'app-avatar-list',
    templateUrl: './avatar-list.component.html',
    styleUrls: ['./avatar-list.component.scss']
})
export class AvatarListComponent implements OnInit {
    avatars = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    selectedAvatar = localStorage.getItem('avatar');

    constructor(private sideNavService: SideNavService) {}

    ngOnInit(): void {}

    selectAvatar(avatar: string) {
        this.selectedAvatar = avatar;
        localStorage.setItem('avatar', avatar);
        this.sideNavService.emitSelectedAvatar(this.selectedAvatar);
    }
}
