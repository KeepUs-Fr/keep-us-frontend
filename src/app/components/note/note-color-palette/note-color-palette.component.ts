import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-note-color-palette',
    templateUrl: './note-color-palette.component.html',
    styleUrls: ['./note-color-palette.component.scss']
})
export class NoteColorPaletteComponent implements OnInit, OnChanges {
    @Output() eventEmitter = new EventEmitter<{ key: string; value: string }>();
    @Input() detailColor = '';

    colors = new Map<string, string>();
    selectedColor = 'blue';

    constructor() {}

    ngOnInit() {
        this.colors
            .set('blue', '#5AADF9')
            .set('red', '#FF6262')
            .set('green', '#22A991')
            .set('orange', '#F98A5A')
            .set('purple', '#B28BB9');

        this.initColor();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initColor();
    }

    getCurrentColor(color: string): void {
        this.selectedColor = color;
        this.eventEmitter.emit({ key: color, value: this.colors.get(color)! });
    }

    private initColor() {
        if (this.detailColor !== '') {
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
}
