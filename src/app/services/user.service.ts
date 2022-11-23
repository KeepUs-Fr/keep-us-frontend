import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateGroupModel, GroupModel } from '../models/group.model';
import { UserModel } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    // Observable string sources
    private emitGroupIdSource = new Subject<{
        id: number;
        clearNoteId: boolean;
    }>();
    // Observable string streams
    groupIdEmitted = this.emitGroupIdSource.asObservable();

    constructor(private http: HttpClient) {}

    emitGroupId(change: { id: number; clearNoteId: boolean }) {
        this.emitGroupIdSource.next(change);
    }

    getUserById(id: number): Observable<UserModel> {
        return this.http.get<UserModel>(
            environment.baseUrl + '/auth/account/' + id
        );
    }

    updateAvatar(id: number, avatarId: number): Observable<UserModel> {
        let queryParam = new HttpParams();
        queryParam = queryParam.append('avatar', avatarId);

        return this.http.patch<UserModel>(
            environment.baseUrl + '/auth/account/' + id,
            {},
            {
                params: queryParam
            }
        );
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

    getGroupMembers(id: number): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(environment.baseUrl + '/groups/' + id + '/members');
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
            environment.baseUrl + '/groups/' + groupId + '/member',
            {},
            { params: queryParam }
        );
    }

    deleteGroupMember(groupId: number, userId: number): Observable<void> {
        return this.http.patch<void>(
            environment.baseUrl + '/groups/' + groupId + '/member/' + userId,
            {},
        );
    }

    deleteGroup(id: number): Observable<void> {
        return this.http.delete<void>(environment.baseUrl + '/groups/' + id);
    }
}
