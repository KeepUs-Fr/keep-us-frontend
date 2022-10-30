import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackBarService {
    constructor(private snackBar: MatSnackBar) {}

    openSuccess(message: string) {
        this.snackBar.open(message, 'Fermer', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
        });
    }

    openError(message: string) {
        this.snackBar.open(message, 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
        });
    }
}
