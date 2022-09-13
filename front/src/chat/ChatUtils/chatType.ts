export type ChannelT = {
	channelId: string,
	nbClients: number,
	mode: ChannelModes
	owner: string,
    handleJoinChannel: ( data:JoinChannelT ) => void;
}

export type messageT = {
    sender : string,
    content : string
}

export enum ChannelModes {
	Public,
	Private,
	Password,
}

export type ActionOnUser = {
	channelName: string,
	targetId:	string,
	duration: number,
}

export type JoinChannelT = {
	channelName: string,
	password?: string
}

export type UserStateT = {
	isOwner: boolean,
	isAdmin: boolean,
	isMuted: boolean,
	unmuteDate?: number,
	unbanDate?: number
}

export type ClientInfoT = {
	isOwner: boolean,
	isAdmin: boolean,
	isMuted: boolean
}

export type InviteClientT = {
	channelName: string,
	clientId: string,
}