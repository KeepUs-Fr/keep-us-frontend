import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteFiltersComponent } from './note-filters.component';

describe('NoteFiltersComponent', () => {
    let component: NoteFiltersComponent;
    let fixture: ComponentFixture<NoteFiltersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NoteFiltersComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NoteFiltersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
