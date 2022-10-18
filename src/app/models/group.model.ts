export class GroupModel {
    id: number;
    name: string;
    ownerId: number;
    members: number[];

    constructor() {
        this.id = 0;
        this.name = '';
        this.ownerId = 0;
        this.members = [];
    }
}

export interface CreateGroupModel {
    name: string;
    ownerId: number;
    members: number[];
}
