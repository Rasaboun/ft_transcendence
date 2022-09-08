import { Socket } from "socket.io"
import { Channel } from "../channel/channel"

export type AuthenticatedSocket = Socket & {
	data: {
		channel: null | Channel;
	}
}

export type ChannelClient = {
	id: string,
	isAdmin: boolean,
	isMuted: boolean,
}

export type Message = {
	sender: string,
	content: string,
}