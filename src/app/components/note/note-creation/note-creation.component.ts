import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-note-creation',
  templateUrl: './note-creation.component.html',
  styleUrls: ['./note-creation.component.scss']
})
export class NoteCreationComponent implements OnInit {

    @Output() mode = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  submit(): void {
      this.cancel();
  }

  cancel(): void {
        this.mode.emit(false);
  }
}
