import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-delete-account',
    templateUrl: './delete-account.component.html',
    styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent {
    hide = true;
    password = '';
    errorMsg = '';
    warningList: string[] = [
        'Le profil, les groupes, ainsi que les notes associés à ce compte ne seront plus disponibles.',
        'Vous ne pourrez plus accéder aux informations du compte, à l\'espace personnel, aux differents groupes, ni aux notes.',
        'La suppression du compte est une action irreversible. Toutes les données seront supprimées.'
    ]

    constructor(private authService: AuthService) {}

    deleteAccount() {
        this.authService.deleteAccount(this.password).subscribe({
            next: (_) => {
                this.authService.logout();
            },
            error: (err) => {
                console.error(err);
                if (err.status === 403)
                    this.errorMsg =
                        'Suppression impossible, le mot de passe est incorrect';
            }
        });
    }
}
