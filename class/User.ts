export enum Role {
    OWNER = 0,
    EDITOR = 1,
    ANALYST = 2
}

export default class User {
    constructor(public pseudo: string, public password: string, public role: Role, public created_at: Date) {}
}