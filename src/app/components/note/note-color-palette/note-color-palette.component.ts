import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-note-color-palette',
    templateUrl: './note-color-palette.component.html',
    styleUrls: ['./note-color-palette.component.scss']
})
export class NoteColorPaletteComponent implements OnInit {
    @Output() eventEmitter = new EventEmitter<string>();
    colors = new Map<string, string>();
    selectedColor = 'black';

    constructor() {}

    ngOnInit(): void {
        this.colors
            .set('black', '#424242')
            .set('red', '#5c2b29')
            .set('orange', '#614a19')
            .set('yellow', '#635d19')
            .set('green', '#345920')
            .set('cyan', '#2d555e')
            .set('blue', '#1e3a5f')
            .set('purple', '#42275e')
            .set('pink', '#5b2245')
            .set('brown', '#442f19');
    }

    getCurrentColor(color: string): void {
        this.selectedColor = color;
        this.eventEmitter.emit(color);
    }
}
