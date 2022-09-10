import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss']
})
export class AddGroupComponent implements OnInit {
    name: string = '';

    constructor(private userService: UserService) { }

    ngOnInit(): void {
    }

    submit() {
        this.userService.createGroup(this.name).subscribe(_ => {});
    }

}
