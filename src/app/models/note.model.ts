export interface NoteModel {
    id: number;
    title: string;
    content: string;
    position: number;
    lock: boolean;
    color: string;
    ownerId: number;
    groupId: number;
    createDate: Date;
    updateDate: Date;
}

export interface CreateNoteModel {
    title: string;
    content: string;
    position: number;
    lock: boolean;
    color: string;
    ownerId: number;
    groupId: number;
}
