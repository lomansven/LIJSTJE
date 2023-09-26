import { BaseEntitySchemaDefinition, BaseEntitySchemaSettings, IEntity } from "./base.entity";
import { Schema, model } from "dynamoose";

export interface IUser extends IEntity {
    name: string;
    email: string;
    password: string;
}

const UserSchema = new Schema({
    ...BaseEntitySchemaDefinition,
    name: {
        type: String,
        required: true
        // TODO: validate email format (simple version: at least an @ in there) & uniqueness
    },
    email: {
        type: String,
        required: true
        // TODO: validate uniqueness
    },
    password: {
        type: String,
        required: true
        // TODO: validate against database of frequently used passwords
    }
}, BaseEntitySchemaSettings);

export const User = model<IUser>("LijstjeUser", UserSchema);
