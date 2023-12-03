import express from 'express';
import { LijstjeLogger, parseLoginToken, processError } from './utils';

export function Authentication(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    // Get token from headers
    const token = req.headers.authorization;
    LijstjeLogger.info(`Received token: ${token}`);
    if (!token || !token.includes("Bearer ")) {
      // Response with 401 to notify missing token
      res.status(401).json({
        message: "No (valid) required authorization token was provided."
      });
      return;
    }
    // Parse token & decode to payload
    const jwt = token.replaceAll("Bearer ","");
    const payload = parseLoginToken(jwt);
    // Set user information on request, this will be passed to other endpoints
    req.headers.userId = payload._id;
    req.headers.lastLoginAt = payload._lastLoginAt.toString();
    // Continue with request
    next();
  } catch (error) {
    // Process thrown error
    processError(res, error);
  }
}