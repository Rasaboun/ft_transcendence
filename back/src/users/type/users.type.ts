export enum UserStatus {
    offline,
    online,
    ingame,
}

export type Friend = {
    login: string,
    username: string,
    status: UserStatus,
}