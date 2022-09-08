import { Socket } from "socket.io"
import { Channel } from "../channel/channel"

export type AuthenticatedSocket = Socket & {
	data: {
		channel: null | Channel;
	}
}

export class ChannelClient {
	public isAdmin: boolean = false;
	public isMuted: boolean = false;
	public unmuteDate: Date = null;
	public unbanDate: Date = null;
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