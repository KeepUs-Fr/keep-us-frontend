export interface NoteModel {
    id: number;
    title: string;
    description: string;
    tag: string;
    color: string;
    ownerId?: string;
    groupId?: string;
    createDate: Date;
}

export interface CreateNoteModel {
    title: string;
    description: string;
    tag: string;
    color: string;
}
