import { Response } from 'express';
import { LijstjeError } from "./lijstjeError";
import bcrypt from "bcryptjs";
import { pickBy } from 'lodash';
import constants from './constants';
import jwt from "jsonwebtoken";

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
    res.status(status).json({ message });
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, constants.BCRYPT_SALT_ROUNDS);
}

export function comparePassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

export interface TokenPayload {
  _id: string;
  _lastLoginAt: number;
}
export function generateLoginToken(_id: string): string {
  // Assert that LIJSTJE_TOKEN_SECRET is set in .env
  if (!process.env.LIJSTJE_TOKEN_SECRET) {
    console.error("LIJSTJE_TOKEN_SECRET not set in .env");
    throw new LijstjeError({
      status: 500,
      message: "Something went wrong while trying to generate a session token."
    });
  }
  // Build token payload
  const payload = {
    _id,
    _lastLoginAt: Date.now()
  };
  // Generate JWT token
  return jwt.sign(payload, process.env.LIJSTJE_TOKEN_SECRET, { expiresIn: constants.LOGIN_TOKEN_LIFESPAN_MS });
}

export function parseLoginToken(token: string): TokenPayload {
  // Assert that JWT_SECRET is set in .env
  if (!process.env.LIJSTJE_TOKEN_SECRET) {
    console.error("LIJSTJE_TOKEN_SECRET not set in .env");
    throw new LijstjeError({
      status: 500,
      message: "Something went wrong while trying to verify session token."
    });
  }
  // Decode JWT token & parse to original payload
  const payload = jwt.verify(token, process.env.LIJSTJE_TOKEN_SECRET);
  return JSON.parse(JSON.stringify(payload)) as TokenPayload;
}

export function omitUndefined(object: object) {
  return pickBy(object, (x) => x !== undefined);
}

export function formatDate(date: Date): string {
  return `${padNumber(date.getDate())}-${padNumber(date.getMonth())}-${date.getFullYear()}`;
}

export function formatTime(date: Date, milliseconds?: boolean): string {
  return `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}:${padNumber(date.getSeconds())}${milliseconds ? `.${padNumber(date.getMilliseconds(), 3)}` : ''}`;
}

function padNumber(input: number, length?: number): string {
  return String(input).padStart(length ? length : 2, "0");
}

/**
 * LijstjeLogger for customized logging
 * TODO: share between app and server
 */
export class LijstjeLogger {
  public static info(text: string): void {
    console.log(`${this.prefix()} ${text}`);
  }

  public static warning(text: string): void {
    console.warn(`${this.prefix()} ${text}`);
  }
  
  public static error(text: string): void {
    console.error(`${this.prefix()} ${text}`);
  }

  private static prefix(): string {
    const dateTime = new Date();
    return `[${formatDate(dateTime)} ${formatTime(dateTime, true)}]`;
  }
}
