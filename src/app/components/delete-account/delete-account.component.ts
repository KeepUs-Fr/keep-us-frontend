import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent {
    hide = true;
    password = '';
    errorMsg = '';

    constructor(private authService: AuthService) { }


    deleteAccount() {
        this.authService.deleteAccount(this.password).subscribe({
            next: _ => {
                this.authService.logout();
            },
            error: err => {
                console.error(err);
                if (err.status === 403)
                    this.errorMsg = 'Suppression impossible, le mot de passe est incorrect'
            }
        })
    }
}
