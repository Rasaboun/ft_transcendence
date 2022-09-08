export type ChannelT = {
	channelId: string,
	clientsId: string[]
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