import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import {CreateGroupModel, GroupModel} from "../models/group.model";
import {UserModel} from "../models/user.model";

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

    getUserByUsername(username: string): Observable<UserModel> {
        let queryParam = new HttpParams();
        queryParam = queryParam.append('username', username);

        return this.http.get<UserModel>(environment.userUrl, {
            params: queryParam
        });
    }

    createUser(username: string): Observable<UserModel> {
        const newUser = { username: username };

        return this.http.post<UserModel>(environment.userUrl, newUser);
    }

    getGroupByOwnerId(id: number): Observable<GroupModel[]> {
        return this.http.get<GroupModel[]>(environment.userUrl + '/groups/' + id);
    }

    createGroup(groupName: string): Observable<GroupModel> {
        const group: CreateGroupModel = {
            name: groupName,
            ownerId: +localStorage.getItem('ownerId')!,
            members: []
        };
        return this.http.post<GroupModel>(environment.userUrl + '/groups', group);
    }

    deleteGroup(id: number): Observable<void> {
        return this.http.delete<void>(environment.userUrl + '/groups/' + id);
    }
}
