import { Injectable } from '@angular/core';
import {
    debounceTime,
    distinctUntilChanged,
    fromEvent,
    Observable,
    startWith
} from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ResponsiveService {
    width$: Observable<number>;
    isMobile$: Observable<boolean>;

    constructor() {
        this.width$ = fromEvent(window, 'resize').pipe(
            startWith(window.innerWidth),
            debounceTime(200),
            distinctUntilChanged(),
            map(() => window.innerWidth),
            shareReplay(1)
        );
        this.isMobile$ = this.width$.pipe(map((width) => width <= 768));
    }
}
