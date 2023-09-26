import { IEntity } from "./base.entity";

export interface IGroup extends IEntity {
    name: string;
    description: string;
    admin: string;
    participants: string[];
}