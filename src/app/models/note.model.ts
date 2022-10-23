export interface NoteModel {
    id: number;
    title: string;
    content: string;
    color: string;
    ownerId: number;
    groupId: number;
    createDate: Date;
}

export interface CreateNoteModel {
    title: string;
    content: string;
    color: string;
    ownerId: number;
    groupId: number;
}
