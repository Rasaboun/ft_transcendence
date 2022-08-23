import { Game } from "./Game";
import { User } from "./User";
import { TypeORMSession } from "./Session";

const entities = [User, Game, TypeORMSession];

export { User, Game, TypeORMSession };

export default entities;
