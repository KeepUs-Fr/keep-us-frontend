import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    hide = true;
    loginForm: FormGroup;
    usernameCtrl: FormControl;
    passwordCtrl: FormControl;

    constructor(private authService: AuthService,
                private router: Router,
                public formBuilder: FormBuilder) {
        this.usernameCtrl = formBuilder.control('', Validators.required);
        this.passwordCtrl = formBuilder.control('', Validators.required);

        this.loginForm = formBuilder.group({
            username: this.usernameCtrl,
            password: this.passwordCtrl
        });
    }

    ngOnInit(): void {
       if (this.authService.isLogged())
           this.router.navigate(['notes']).then();
    }

    onSubmit(): void {
        this.authService.login(this.loginForm.value).subscribe({
            next: (result: {token: string}) => {
                localStorage.setItem('token', result.token);
                this.authService.emitChange(true);
                this.router.navigate(['notes']).then();

            },
            error: (error) => {
                console.error(error);
            }
        });
    }

}
