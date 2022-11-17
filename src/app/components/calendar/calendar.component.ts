import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { UserService } from '../../services/user.service';
import { NotesService } from '../../services/notes.service';
import { DatePipe } from '@angular/common';
import { NoteModel } from "../../models/note.model";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
    @Input() notes: NoteModel[] = [];
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

    ngOnInit() {
        this.isLoading = true;
        this.addToEventList(this.notes);
    }

    private addToEventList(noteList: NoteModel[]): void {
        for (let note of noteList) {
            const date = this.datePipe.transform(note.createDate, 'yyyy-MM-dd')!;
            this.events.push(
                {
                    title: note.title,
                    date,
                    color: note.color,
                    borderColor: note.color
                });
        }
        this.isLoading = false;
    }
}
