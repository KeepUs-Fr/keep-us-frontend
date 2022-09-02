import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    selectedAvatar = "";

    constructor(public authService: AuthService) {}

    ngOnInit(): void {
        this.selectedAvatar = localStorage.getItem('avatar')!;
    }
}
