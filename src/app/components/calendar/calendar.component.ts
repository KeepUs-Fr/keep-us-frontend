import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { UserService } from '../../services/user.service';
import { NotesService } from '../../services/notes.service';
import { DatePipe } from '@angular/common';
import { GroupModel } from '../../models/group.model';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    isLoading = false;
    events: {
        title: string;
        date: string;
        color: string;
        borderColor: string;
    }[] = [];

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        events: []
    };

    constructor(
        private userService: UserService,
        private notesService: NotesService,
        private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.getGroups();
    }

    private getGroups(): void {
        this.isLoading = true;
        this.userService
            .getGroupByOwnerId(+localStorage.getItem('ownerId')!)
            .subscribe({
                next: (groups) => {
                    this.addToEventList(groups);
                    this.calendarOptions.events = this.events;
                    this.isLoading = false;
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error(err);
                }
            });
    }

    private addToEventList(groupList: GroupModel[]): void {
        for (let group of groupList) {
            this.notesService.getNotes(group.id).subscribe((notes) => {
                for (let note of notes) {
                    const date = this.datePipe.transform(
                        note.createDate,
                        'yyyy-MM-dd'
                    )!;
                    this.events.push({
                        title: note.title,
                        date,
                        color: note.color,
                        borderColor: note.color
                    });
                }
            });
        }
    }
}
