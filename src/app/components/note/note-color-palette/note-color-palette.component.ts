import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-note-color-palette',
    templateUrl: './note-color-palette.component.html',
    styleUrls: ['./note-color-palette.component.scss']
})
export class NoteColorPaletteComponent implements OnInit {
    @Output() eventEmitter = new EventEmitter<{ key: string; value: string }>();
    @Input() detailColor: string = '';

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

        if (
            this.detailColor.trim() !== null &&
            this.detailColor.trim() !== ''
        ) {
            let key = [...this.colors.entries()]
                .filter(({ 1: n }) => n === this.detailColor)
                .map(([k]) => k);

            this.selectedColor = key[0];
            this.eventEmitter.emit({
                key: this.selectedColor,
                value: this.detailColor
            });
        }
    }

    getCurrentColor(color: string): void {
        this.selectedColor = color;
        this.eventEmitter.emit({ key: color, value: this.colors.get(color)! });
    }
}
