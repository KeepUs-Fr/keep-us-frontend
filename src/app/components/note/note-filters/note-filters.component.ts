import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-note-filters',
    templateUrl: './note-filters.component.html',
    styleUrls: ['./note-filters.component.scss']
})
export class NoteFiltersComponent implements OnInit {
    filteredColor = '';
    constructor() {}

    ngOnInit(): void {}

    getColor(color: string) {
        this.filteredColor = color;
    }
}
