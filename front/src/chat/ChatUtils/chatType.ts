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

// Priv chat part
export type privChatP = {
	PrivChatId: number,
	client1: number,
	client2: number,
    handleNewPrivateChat: (PrivChatId: number) => void
}

export type privMessageT = {
    sender : number,
    content : string
}
