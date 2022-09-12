export type ChannelT = {
	channelId: string,
	nbClients: number,
	isPrivate: boolean,
	isPasswordProtected: boolean,
	owner: string,
    handleJoinChannel: (channelId: string) => void
}

export type messageT = {
    sender : string,
    content : string
}

export type ActionOnUser = {
	channelName: string,
	targetId:	string,
	duration: number,
}