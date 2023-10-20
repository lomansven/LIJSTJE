import { Response } from 'express';
import { LijstjeError } from "./lijstjeError";
import bcrypt from "bcryptjs";
import { pickBy } from 'lodash';
import { BCRYPT_SALT_ROUNDS } from './constants';

export function processError(res: Response, error: any) {
    // Parse & respond with error
    const { 
      status: lijstjeStatus,
      message: lijstjeMessage
    } = error as LijstjeError;
    // Compose status & response message
    const status = lijstjeStatus ? lijstjeStatus : 500;
    const message = lijstjeMessage ? lijstjeMessage : JSON.stringify(error);
    // Respond with status & error
    res.status(status).json(message);
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
}

export function comparePassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

export function omitUndefined(object: object) {
  return pickBy(object, (x) => x !== undefined);
}
