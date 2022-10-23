import {Component, OnInit} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
    hide = true;
    signupForm: FormGroup;
    usernameCtrl: FormControl;
    passwordCtrl: FormControl;

    constructor(
        private authService: AuthService,
        private router: Router,
        public formBuilder: FormBuilder,
        private userService: UserService
    ) {
        this.usernameCtrl = formBuilder.control('', Validators.required);
        this.passwordCtrl = formBuilder.control('', Validators.required);

        this.signupForm = formBuilder.group({
            username: this.usernameCtrl,
            password: this.passwordCtrl
        });
    }

    ngOnInit() {
        if (this.authService.isLogged()) {
            this.router.navigate(['notes']).then();
        }
    }

    onSubmit(): void {
        this.authService.signup(this.signupForm.value).subscribe({
            next: (_) => {
                this.authService.login(this.signupForm.value).subscribe({
                    next: (result) => {
                        localStorage.setItem('token', result.token);
                        this.authService.decodedToken =
                            this.authService.decodeToken(result.token);

                        this.userService
                            .createUser(this.authService.decodedToken.sub)
                            .subscribe((user) => {
                                localStorage.setItem(
                                    'ownerId',
                                    user.id.toString()
                                );
                                this.authService.emitChange(true);
                                this.router.navigate(['notes']).then();
                            });
                    },
                    error: (error) => {
                        console.error(error);
                    }
                });
            },
            error: (error) => {
                console.error(error);
            }
        });
    }
}
