import { Component } from '@angular/core';
import { SideNavService } from '../../../services/side-nav.service';

@Component({
    selector: 'app-avatar-list',
    templateUrl: './avatar-list.component.html',
    styleUrls: ['./avatar-list.component.scss']
})
export class AvatarListComponent {
    avatars = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    selectedAvatar = localStorage.getItem('avatarId');

    constructor(
        private sideNavService: SideNavService,
    ) {}


    selectAvatar(avatar: string) {
        this.selectedAvatar = avatar;
        localStorage.setItem('avatarId', avatar);
        this.sideNavService.emitSelectedAvatar(this.selectedAvatar);
    }
}
