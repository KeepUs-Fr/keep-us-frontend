import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SideNavService {
    // Observable string sources
    private emitAvatarSource = new Subject<string>();
    // Observable string streams
    avatarEmitted = this.emitAvatarSource.asObservable();

    constructor() {}

    emitSelectedAvatar(change: string) {
        this.emitAvatarSource.next(change);
    }
}
