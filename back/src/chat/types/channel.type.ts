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
	public muteDuration: number = 0;
	public banDuration: number = 0;
	constructor(
		public id: string
	){}
}

export type Message = {
	sender: string,
	content: string,
}