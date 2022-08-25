import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
    /**
     * Number of notes on grid line
     */
    valueCols: number = 1;

    constructor() { }

    ngOnInit(): void {
        this.breakPoints();
    }

    breakPoints(): void {
        switch (true) {
            case window.innerWidth <= 730:
                this.valueCols = 1;
                break;
            case window.innerWidth > 730 && window.innerWidth <= 1020:
                this.valueCols = 2;
                break;
            case window.innerWidth > 1020 && window.innerWidth <= 1200:
                this.valueCols = 3;
                break;
            default:
                this.valueCols = 4;
        }
    }

}
