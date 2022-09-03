import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

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
    groups: string[] = [];
    selectedGroup = '';
    selectedAvatar = '';

    constructor(
        private breakpointObserver: BreakpointObserver,
        public authService: AuthService
    ) {}

    ngOnInit(): void {
        this.isLogged = this.authService.isLogged();
        this.authService.changeEmitted.subscribe((value) => {
            this.isLogged = value;
        });

        this.getAvatar();

        this.groups = ['Personal space', 'Couple', '#work'];
        this.selectedGroup = this.groups[0];
    }

    groupAction(groupName: string): void {
        this.selectedGroup = groupName;
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
}
