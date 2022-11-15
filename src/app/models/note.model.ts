export interface NoteModel {
    id: number;
    title: string;
    content: string;
    position: number;
    lock: boolean;
    isLock: boolean;
    color: string;
    ownerId: number;
    groupId: number;
    createDate: Date;
}

export interface CreateNoteModel {
    title: string;
    content: string;
    position: number;
    isLock: boolean;
    color: string;
    ownerId: number;
    groupId: number;
}
