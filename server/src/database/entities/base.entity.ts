import { Item } from "dynamoose/dist/Item";
import { SchemaDefinition } from "dynamoose/dist/Schema";
import { generateUUID } from "../utils";

/**
 * Base Entity used in the DB
 * 
 * Attributes:
 * - _id {string}: randomly generated uuid used for identifying entities
 * - _createdAt {number}: timestamp when this entity was created
 * - _updatedAt {number}: timestamp when this entity was last updated
 */
export interface IEntity extends Item {
    _id: string;
    _createdAt: number;
    _updatedAt: number;
}
export const BaseEntitySchemaDefinition: SchemaDefinition = {
    _id: {
        type: String,
        default: generateUUID,
        required: true
    }
}
export const BaseEntitySchemaSettings: any = {
    createdAt: "_createdAt",
    updatedAt: "_updatedAt"
}