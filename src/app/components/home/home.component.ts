import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import {ResponsiveService} from "../../services/responsive.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    lottieThink: AnimationOptions = {
        path: '/assets/lottie/think.json',
        autoplay: true,
        loop: true
    };

    lottieCalendar: AnimationOptions = {
        path: '/assets/lottie/calendar.json',
        autoplay: true,
        loop: true
    };

    lottieGroup: AnimationOptions = {
        path: '/assets/lottie/group.json',
        autoplay: true,
        loop: true
    };

    lottiePuzzle: AnimationOptions = {
        path: '/assets/lottie/puzzle.json',
        autoplay: true,
        loop: true
    };

    isMobile$ = this.responsiveService.isMobile$;

    constructor(private responsiveService: ResponsiveService) {}

    ngOnInit(): void {}

    onAnimate(animationItem: AnimationItem) {}
}
