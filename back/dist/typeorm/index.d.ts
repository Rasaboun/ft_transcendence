import { Match } from "./Match";
import { User } from "./User";
import { TypeORMSession } from "./Session";
declare const entities: (typeof Match | typeof User | typeof TypeORMSession)[];
export { User, Match, TypeORMSession };
export default entities;
