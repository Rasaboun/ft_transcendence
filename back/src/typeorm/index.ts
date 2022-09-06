import { Match } from "./Match";
import { User } from "./User";
import { Channel } from "./Chat";
import { TypeORMSession } from "./Session";

const entities = [User, Match, Channel, TypeORMSession];

export { User, Match, Channel, TypeORMSession };

export default entities;
