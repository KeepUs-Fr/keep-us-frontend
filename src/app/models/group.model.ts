export interface GroupModel {
    id: string
    name: string;
    ownerId: number;
    members: number[]
}

export interface CreateGroupModel {
    name: string;
    ownerId: number;
    members: number[]
}
