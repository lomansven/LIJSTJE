import 'reflect-metadata';
import express from 'express';
import serverless from 'serverless-http';
import cors from "cors";
import dotenv from "dotenv";
import routes from './routes';

// process.env now accesible
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors());

app.use('/', routes);

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send();
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(err.status || 500).send();
});

export const handler = serverless(app);
