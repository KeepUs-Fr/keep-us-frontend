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

    getNotes(id: number): Observable<NoteModel[]> {
        return this.http.get<NoteModel[]>(
            environment.baseUrl + '/notes/group/' + id
        );
    }

    getNoteById(id: number): Observable<NoteModel> {
        return this.http.get<NoteModel>(environment.baseUrl + '/notes/' + id);
    }

    filterNoteByColor(color: string, groupId: number): Observable<NoteModel[]> {
        let queryParam = new HttpParams();
        queryParam = queryParam.append('color', color);
        queryParam = queryParam.append('groupId', groupId);

        return this.http.get<NoteModel[]>(
            environment.baseUrl + '/notes/filter',
            {
                params: queryParam
            }
        );
    }

    createNote(note: CreateNoteModel): Observable<NoteModel> {
        return this.http.post<NoteModel>(environment.baseUrl + '/notes', note);
    }

    updateNote(note: NoteModel): Observable<NoteModel> {
        return this.http.patch<NoteModel>(
            environment.baseUrl + '/notes',
            note
        );
    }

    updatePosition(notes: NoteModel[]): Observable<void> {
        return this.http.patch<void>(environment.baseUrl + '/notes/positions', notes);
    }

    deleteNote(id: number): Observable<void> {
        return this.http.delete<void>(environment.baseUrl + '/notes/' + id);
    }

    deleteAllNote(groupId: number): Observable<void> {
        return this.http.delete<void>(
            environment.baseUrl + '/group/' + groupId
        );
    }
}
