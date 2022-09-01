import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Observable string sources
    private emitChangeSource = new Subject<boolean>();
    // Observable string streams
    changeEmitted = this.emitChangeSource.asObservable();

    constructor(
        private router: Router,
        private http: HttpClient,
    ) {}

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    emitChange(change: boolean) {
        this.emitChangeSource.next(change);
    }

    //
    // register(registerData: RegisterModel): Observable<RegisterModel> {
    //     registerData.photo = environment.userDefaultUrl;
    //     return this.http.post<RegisterModel>(
    //         environment.baseUrl + 'auth/register',
    //         registerData
    //     );
    // }

    login(credential: any): Observable<any> {
        return this.http.post<any>(
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
}
