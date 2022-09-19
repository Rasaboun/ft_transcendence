import { HttpException } from "@nestjs/common";
import { Socket } from "socket.io"
import { Channel } from "../channel/channel"

export type AuthenticatedSocket = Socket & {
	sessionId: string,
	roomId: string,
	login: string,
}

export class ChannelClient {
	public isOwner: boolean = false;
	public isAdmin: boolean = false;
	public isMuted: boolean = false;
	public isBanned: boolean = false;
	public unmuteDate: number = 0;
	public unbanDate: number = 0;
	public joinedDate: Date = new Date();
	constructor(
		public id: string
	){}
}

export enum ChannelModes {
	Public,
	Private,
	Password,
}

export class MutedException extends HttpException
{

    constructor(objectOrError?: string | object | any, time?: number, description?: string)
	{
		super(objectOrError, 401);
	}
}

export type Message = {
	sender: {
		login: string,
		username: string,
	},
	channelName?: string,
	content: string,
	date?: string,
	isInfo: boolean,
}

export type ActionOnUser = {
	channelName: string,
	targetId:	string,
	duration: number,
}

export type JoinChannel = {
	channelName: string,
	password: string|undefined,
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

export type ClientInfo = {
	login: string,
	username: string,
	isOwner: boolean,
	isAdmin: boolean,
	isMuted: boolean,
}

export type CreateChannel = {
	name: string,
	mode: ChannelModes,
	password: string,
	ownerId: string
}

export type ChannelInfo = {
	channelId: string,
	clients?: ClientInfo[],
	nbClients: number,
	mode: ChannelModes,
	owner: string,
}