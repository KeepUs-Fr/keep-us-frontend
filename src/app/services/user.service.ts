import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateGroupModel, GroupModel } from '../models/group.model';
import { UserModel } from '../models/user.model';
import { query } from "@angular/animations";

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

        return this.http.get<UserModel>(environment.baseUrl + '/users', {
            params: queryParam
        });
    }


    getGroupsByOwnerId(id: number): Observable<GroupModel[]> {
        return this.http.get<GroupModel[]>(
            environment.baseUrl + '/groups/owner/' + id
        );
    }

    getGroupById(id: number): Observable<GroupModel> {
        return this.http.get<GroupModel>(environment.baseUrl + '/groups/' + id);
    }

    createGroup(group: CreateGroupModel): Observable<GroupModel> {
        return this.http.post<GroupModel>(
            environment.baseUrl + '/groups',
            group
        );
    }

    addGroupMember(groupId: number, username: string): Observable<GroupModel> {
        let queryParam = new HttpParams();
        queryParam = queryParam.append('username', username);

        return this.http.patch<GroupModel>(
            environment.baseUrl + '/groups/' + groupId + '/member',{},
            {params: queryParam}
        );
    }

    deleteGroup(id: number): Observable<void> {
        return this.http.delete<void>(environment.baseUrl + '/groups/' + id);
    }
}
