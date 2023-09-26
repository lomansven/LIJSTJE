import { IEntity } from "./base.entity";

export interface IList extends IEntity {
    name: string;
    admin: string;
    participants: string[];
}