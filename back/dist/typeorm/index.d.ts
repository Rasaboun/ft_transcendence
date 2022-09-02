import { Match } from "./Match";
import { User } from "./User";
import { TypeORMSession } from "./Session";
declare const entities: (typeof User | typeof Match | typeof TypeORMSession)[];
export { User, Match, TypeORMSession };
export default entities;
