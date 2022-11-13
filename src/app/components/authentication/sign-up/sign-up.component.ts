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

    signupForm: FormGroup;

    usernameCtrl: FormControl;
    emailCtrl: FormControl;
    passwordCtrl: FormControl;

    constructor(
        private authService: AuthService,
        private router: Router,
        public formBuilder: FormBuilder,
        private userService: UserService
    ) {
        this.usernameCtrl = formBuilder.control(null, [
            Validators.required,
            Validators.pattern(/^[A-z0-9]*$/),
            Validators.minLength(3)
        ]);
        this.emailCtrl = formBuilder.control(null,[
            Validators.required,
            Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        ]);
        this.passwordCtrl = formBuilder.control('', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(40),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
        ]);

        this.signupForm = formBuilder.group({
            username: this.usernameCtrl,
            email: this.emailCtrl,
            password: this.passwordCtrl,
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

        this.authService.signup(this.signupForm.value).subscribe({
            next: (res) => {
                this.authService.login(this.signupForm.value).subscribe({
                    next: (result) => {
                        localStorage.setItem('token', result.token);
                        localStorage.setItem('refreshKey', result.refreshKey);
                        this.authService.decodedToken = this.authService.decodeToken(result.token);
                        localStorage.setItem('ownerId', this.authService.decodedToken.id.toString());

                        const group: CreateGroupModel = {
                            name: "Personal space",
                            ownerId: res.id,
                            members: []
                        }
                        this.userService.createGroup(group).subscribe(_ => {
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
