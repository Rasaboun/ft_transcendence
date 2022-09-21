import { Match } from "./Match";
import { User } from "./User";
import { Channel } from "./Channel";
import { TypeORMSession } from "./Session";
import { PrivChat } from "./PrivChat";
declare const entities: (typeof Match | typeof User | typeof Channel | typeof TypeORMSession | typeof PrivChat)[];
export { User, Match, Channel, TypeORMSession, PrivChat };
export default entities;
