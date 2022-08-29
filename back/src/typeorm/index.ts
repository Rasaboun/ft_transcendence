import { Match } from "./Match";
import { User } from "./User";
import { TypeORMSession } from "./Session";

const entities = [User, Match, TypeORMSession];

export { User, Match, TypeORMSession };

export default entities;
