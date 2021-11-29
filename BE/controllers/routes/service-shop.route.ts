import * as express from 'express';
import {default as sampleShop} from '../../file/shop.json';
import Cart, { ICart } from ".././../models/Cart";

export default () => {
  const route = express.Router();
  route.get('/getShop', getShop);
  route.post('/confirmCart', confirmCart);
  return route;
};

async function getShop(req: express.Request, res: express.Response) {
  res.status(200).send({ error: false, data: sampleShop })
}

async function confirmCart(req: express.Request, res: express.Response) {

  const carts = req.body;
  if (!carts) res.status(404).send({ error: true, message: "Carts not found" })

  const newCart = new Cart({
    carts: carts
  });

  await newCart.save();

  res.status(200).send({ error: false, orderId: newCart._id })
}
