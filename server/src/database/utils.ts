import { v4 as uuid } from 'uuid';

/**
 * Function that generates a UUID string
 * @returns UUID string
 */
export function generateUUID(): string {
    return uuid();
}