import 'reflect-metadata';
import express from 'express';
import serverless from 'serverless-http';
import cors from "cors";
import routes from './routes';
import { LijstjeLogger, formatDate, formatTime } from './utils';
import { Authentication } from './middleware';

const app = express();

app.use(express.json());
app.use(cors());

app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
  // Logs time, method and path of request
  LijstjeLogger.info(`Received ${req.method} request on: ${req.path}`);
  // Continue with request
  next();
});

app.use('/', routes);

app.use((_req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(404).send();
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.status || 500).send();
});

export const handler = serverless(app);
