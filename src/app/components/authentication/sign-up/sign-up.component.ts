import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { CreateGroupModel } from "../../../models/group.model";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
    passwordHidden = true;
    isPasswordFocus = false;
    isLoading = false;
    signupForm: FormGroup;

    constructor(
        private authService: AuthService,
        private router: Router,
        public formBuilder: FormBuilder,
        private userService: UserService
    ) {
        this.signupForm = this.formBuilder.group({
            username: [
                null,
                [
                    Validators.required,
                    Validators.pattern(/^[A-z0-9]*$/),
                    Validators.minLength(3)
                ]
            ],
            email: [
                null,
                [
                    Validators.required,
                    Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
                ]
            ],
            password: [
                null,
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(40),
                    Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
                ]
            ]
        });
    }

    ngOnInit() {
        if (this.authService.isLogged()) {
            this.router.navigate(['notes']).then();
        }
    }

    onSubmit() {
        if(this.signupForm.invalid)
            return

        this.isLoading = true;
        this.authService.signup(this.signupForm.value).subscribe({
            next: (res) => {
                this.authService.login(this.signupForm.value).subscribe({
                    next: (result) => {
                        localStorage.setItem('token', result.token);
                        localStorage.setItem('refreshKey', result.refreshKey);

                        this.authService.decodedToken = this.authService.decodeToken(result.token);

                        const group: CreateGroupModel = {
                            name: "Personal space",
                            ownerId: res.id,
                            members: []
                        }
                        this.userService.createGroup(group).subscribe(_ => {
                            this.authService.emitChange(true);
                            this.isLoading = false;
                            this.router.navigate(['notes']).then();
                        });
                    },
                    error: (error) => {
                        this.isLoading = false;
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
