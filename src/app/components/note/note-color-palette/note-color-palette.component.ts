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
    selectedColor = 'blue';

    constructor() {}

    ngOnInit(): void {
        this.colors
            .set('bleu', '#5AADF9')
            .set('red', '#F95A5A')
            .set('green', '#5AF9DC')
            .set('orange', '#F98A5A')
            .set('purple', '#E25AF9');

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
