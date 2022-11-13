import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { DecodedTokenModel } from '../models/decoded-token.model';
import jwt_decode from 'jwt-decode';
import { AuthModel, AuthRegisterModel } from '../models/auth.model';
import { UserModel } from "../models/user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Observable string sources
    private emitChangeSource = new Subject<boolean>();
    // Observable string streams
    changeEmitted = this.emitChangeSource.asObservable();
    decodedToken: DecodedTokenModel | undefined;

    constructor(private router: Router, private http: HttpClient) {
        if (this.isLogged()) {
            this.decodedToken = this.decodeToken(this.getToken()!);
        }
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    emitChange(change: boolean) {
        this.emitChangeSource.next(change);
    }

    signup(registerData: AuthRegisterModel): Observable<UserModel> {
        return this.http.post<UserModel>(
            environment.baseUrl + '/auth/register',
            registerData
        );
    }

    login(credential: AuthModel): Observable<{ token: string, refreshKey: string }> {
        return this.http.post<{ token: string, refreshKey: string }>(
            environment.baseUrl + '/auth/login',
            credential
        );
    }

    refresh(): Observable<{ token: string, refreshKey: string }> {
        let queryParam = new HttpParams();
        queryParam = queryParam.append('refreshKey', localStorage.getItem('refreshKey')!);

        return this.http.get<{ token: string, refreshKey: string }>(
            environment.baseUrl + '/auth/refresh/' + localStorage.getItem('ownerId')!,
            {params: queryParam});
    }


    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshKey');
        localStorage.removeItem('ownerId');
        localStorage.removeItem('groupId');
        this.emitChange(false);
        this.router.navigate(['login']).then();
    }

    isLogged(): boolean {
        const currentToken = this.getToken();
        return !!currentToken;
    }

    decodeToken(token: string): DecodedTokenModel {
        return jwt_decode(token);
    }
}
