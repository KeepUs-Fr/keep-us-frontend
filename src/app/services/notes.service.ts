import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CreateNoteModel, NoteModel} from "../models/note.model";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NotesService {

    constructor(private http: HttpClient) { }

    getNotes(): Observable<NoteModel[]> {
        return this.http.get<NoteModel[]>(environment.notesUrl);
    }

    createNote(note: CreateNoteModel): Observable<NoteModel> {
        return this.http.post<NoteModel>(
            environment.notesUrl,
            note
        );
    }
}
