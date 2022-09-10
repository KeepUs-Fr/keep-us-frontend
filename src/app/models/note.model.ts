export interface NoteModel {
    id: number;
    title: string;
    description: string;
    tag: string;
    color: string;
    ownerId: number;
    groupId: number;
    createDate: Date;
}

export interface CreateNoteModel {
    title: string;
    description: string;
    tag: string;
    color: string;
    ownerId: number;
    groupId: number;
}
