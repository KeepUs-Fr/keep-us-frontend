export interface GroupModel {
    id: number;
    name: string;
    ownerId: number;
    members: number[];
}

export interface CreateGroupModel {
    name: string;
    ownerId: number;
    members: number[];
}
