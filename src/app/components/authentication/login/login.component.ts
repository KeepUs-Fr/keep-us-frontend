import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    hide = true;
    isLoading = false;
    displayError = false;
    loginForm: FormGroup;

    constructor(
        private authService: AuthService,
        private router: Router,
        public formBuilder: FormBuilder
    ) {
        this.loginForm = this.formBuilder.group({
            username: [null, Validators.required],
            password: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        if (this.authService.isLogged()) {
            this.router.navigate(['notes']).then();
        }
    }

    onSubmit(): void {
        this.isLoading = true;
        this.authService.login(this.loginForm.value).subscribe({
            next: (result) => {
                localStorage.setItem('token', result.token);
                localStorage.setItem('refreshKey', result.refreshKey);

                this.authService.decodedToken = this.authService.decodeToken(
                    result.token
                );

                this.authService.emitChange(true);
                this.isLoading = false;
                this.router.navigate(['notes']).then();
            },
            error: (error) => {
                this.isLoading = false;
                console.error(error);

                if (error.status === 401) {
                    this.displayError = true;
                }
            }
        });
    }
}
