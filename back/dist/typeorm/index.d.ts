import { Match } from "./Match";
import { User } from "./User";
import { Channel } from "./Channel";
import { TypeORMSession } from "./Session";
import { PrivChat } from "./PrivChat";
declare const entities: (typeof TypeORMSession | typeof User | typeof Match | typeof Channel | typeof PrivChat)[];
export { User, Match, Channel, TypeORMSession, PrivChat };
export default entities;
