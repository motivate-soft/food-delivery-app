import * as express from 'express';
import {default as a} from '../../file/shop.json';

export default () => {
  const route = express.Router();
  route.get('/getAll', getAll);
  return route;
};

async function getAll(req: express.Request, res: express.Response) {
  res.status(200).send({ error: false, data: a })
}
