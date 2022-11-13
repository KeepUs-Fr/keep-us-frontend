export interface GroupModel {
    id: number;
    name: string;
    ownerId: number;
    members: number[];
    createDate: Date;
}

export interface CreateGroupModel {
    name: string;
    ownerId: number;
    members: number[];
}
