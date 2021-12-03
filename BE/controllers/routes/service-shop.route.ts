import * as express from 'express';
import {default as sampleShop} from '../../file/shop.json';
import Cart, { ICart } from "../../models/Cart";

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

  const currentD = new Date();
  let startHourD = new Date();
  let endHourD = new Date();
  
  for (const working_hour of sampleShop.working_hours ) {
    const working_time = {
      start: {
        hour: parseInt("" + working_hour.from / 100, 0),
        min: parseInt("" + working_hour.from % 100, 0)
      },
      end: {
        hour: parseInt("" + working_hour.to / 100, 0),
        min: parseInt("" + working_hour.to % 100, 0)
      }
    }

    startHourD.setHours(working_time.start.hour, working_time.start.min, 0);
    endHourD.setHours(working_time.end.hour, working_time.end.min, 0);

    if(currentD <= startHourD || currentD > endHourD ){
      res.status(200).send({ error: true, message: `Sorry, you can't order in that time.` });
      return;
    }
  }


  if (!carts) res.status(404).send({ error: true, message: "Carts not found" })

  const newCart = new Cart(carts);

  await newCart.save();

  res.status(200).send({ error: false, orderId: newCart._id })
}
