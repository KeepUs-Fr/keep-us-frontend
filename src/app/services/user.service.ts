import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
    // Observable string sources
    private emitGroupIdSource = new Subject<number>();
    // Observable string streams
    groupIdEmitted = this.emitGroupIdSource.asObservable();

    constructor(private http: HttpClient) {}


    emitGroupId(change: number) {
        this.emitGroupIdSource.next(change);
    }

    getGroupByUsername(id: string): Observable<any[]> {
        return this.http.get<any[]>(environment.userUrl + '/groups/' + id);
    }

    createGroup(groupName: string): Observable<any> {
        const group = {
            name: groupName,
            ownerId: localStorage.getItem('ownerId'),
            members: []
        }
        return this.http.post<any>(environment.userUrl + '/group', group);
    }
}
