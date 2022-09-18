export type ClientElem = {
	login:string,
	username:string,
	isOwner: boolean,
	isAdmin: boolean,
	isMuted: boolean,
	messages?: messageT[]
}

export type ChannelT = {
	channelId: string,
	clients: ClientElem[]
	nbClients: number,
	mode: ChannelModes
	owner: string,
}

export type messageT = {
    sender?: {
		login:string,
		username:string
	},
    content : string,
	date?:Date
	isInfo?: boolean
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
	isMuted: boolean,
	messages?: messageT[]
}

export type InviteClientT = {
	channelName: string,
	clientId: string,
}

export type SetChannelPasswordT = {
	channelName: string,
	password: string,
}

export type AddAdminT = {
	channelName: string,
	clientId: string,
}

export type channelFormT = {
	name: string,
	mode: ChannelModes,
	password?: string
}

export type MessageInfoT = {
	channelName: string,
	
}