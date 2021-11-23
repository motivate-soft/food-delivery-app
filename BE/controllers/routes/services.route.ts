import * as express from 'express';

export default (app: express.Router) => {
  const route = express.Router();
  return route;
};

async function create(req: express.Request, res: express.Response) {}
