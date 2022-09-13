export type ChannelT = {
	channelId: string,
	nbClients: number,
	isPrivate: boolean,
	isPasswordProtected: boolean,
	owner: string,
    handleJoinChannel: ( data:JoinChannelT ) => void;
}

export type messageT = {
    sender? : string,
    content : string,
	isInfo?: boolean
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

export type SetChannelPasswordT = {
	channelName: string,
	password: string,
}

export type AddAdminT = {
	channelName: string,
	clientId: string,
}