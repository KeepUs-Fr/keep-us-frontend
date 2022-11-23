import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UserModel } from "../../../models/user.model";

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent {

    constructor(
      @Inject(MAT_DIALOG_DATA)
      public data: UserModel[],
    ) { }
}
