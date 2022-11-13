import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from "ngx-lottie";

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
    lottieNotFound: AnimationOptions = {
        path: '/assets/lottie/not-found.json',
        autoplay: true,
        loop: true
    };

    constructor() {}

    ngOnInit(): void {}
}
