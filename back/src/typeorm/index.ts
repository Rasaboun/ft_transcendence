import { Match } from "./Match";
import { User } from "./User";
import { Channel } from "./Channel";
import { TypeORMSession } from "./Session";
import { PrivChat } from "./PrivChat";

const entities = [User, Match, Channel, TypeORMSession, PrivChat];

export { User, Match, Channel, TypeORMSession, PrivChat };

export default entities;
