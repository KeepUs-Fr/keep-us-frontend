import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { DecodedTokenModel } from '../models/decoded-token.model';
import jwt_decode from 'jwt-decode';
import { AuthModel } from '../models/auth.model';

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

    signup(registerData: AuthModel): Observable<void> {
        return this.http.post<void>(
            environment.authUrl + '/register',
            registerData
        );
    }

    login(credential: AuthModel): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(
            environment.authUrl + '/login',
            credential
        );
    }

    logout(): void {
        localStorage.removeItem('token');
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
