import { Socket } from "socket.io"
import { Channel } from "../channel/channel"

export type AuthenticatedSocket = Socket & {
	data: {
		channel: null | Channel;
	}
}

export class ChannelClient {
	public isOwner: boolean = false;
	public isAdmin: boolean = false;
	public isMuted: boolean = false;
	public isBanned: boolean = false;
	public unmuteDate: number = 0;
	public unbanDate: number = 0;
	constructor(
		public id: string
	){}
}

export type Message = {
	sender: string,
	content: string,
}

export type ActionOnUser = {
	channelName: string,
	targetId:	string,
	duration: number,
}

export type JoinChannel = {
	channelName: string,
	password: string,
}

export type SetChannelPassword = {
	channelName: string,
	password: string,
}

export type InviteClient = {
	channelName: string,
	clientId: string,
}

export type AddAdmin = {
	channelName: string,
	clientId: string,
}