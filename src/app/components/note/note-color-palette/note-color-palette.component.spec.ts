import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteColorPaletteComponent } from './note-color-palette.component';

describe('NoteColorPaletteComponent', () => {
    let component: NoteColorPaletteComponent;
    let fixture: ComponentFixture<NoteColorPaletteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NoteColorPaletteComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NoteColorPaletteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
