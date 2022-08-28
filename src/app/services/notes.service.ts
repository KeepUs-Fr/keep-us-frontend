import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateNoteModel, NoteModel } from '../models/note.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotesService {
    constructor(private http: HttpClient) {}

    getNotes(): Observable<NoteModel[]> {
        return this.http.get<NoteModel[]>(environment.notesUrl);
    }

    getNoteById(id: number): Observable<NoteModel> {
        return this.http.get<NoteModel>(environment.notesUrl + '/' + id);
    }

    filterNoteByColor(color: string): Observable<NoteModel[]> {
        let queryParam = new HttpParams();
        queryParam = queryParam.append('color', color);

        return this.http.get<NoteModel[]>(environment.notesUrl + '/filter', {
            params: queryParam
        });
    }

    createNote(note: CreateNoteModel): Observable<NoteModel> {
        return this.http.post<NoteModel>(environment.notesUrl, note);
    }

    updateNote(id: number, note: CreateNoteModel): Observable<NoteModel> {
        return this.http.patch<NoteModel>(
            environment.notesUrl + '/' + id,
            note
        );
    }

    removeNote(id: number): Observable<void> {
        return this.http.delete<void>(environment.notesUrl + '/' + id);
    }
}
