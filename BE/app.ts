import express from 'express';
import childProcess from 'child_process';
import expressLoader from './loaders/express';
import { WebSocketServer } from 'ws';
import Cart, { ICart } from "./models/Cart";

let app = express();

expressLoader({ app });

const wss = new WebSocketServer({ port: 8999 });

wss.on('connection', function connection(ws) {
  ws.on('message', async function message(data) {
    const requestData = JSON.parse(data.toString());

    if (requestData.type === 'infirm_order') {
      const orders = await Cart.findOne({ shop_id: requestData.shop_id, published: false });

      ws.send(JSON.stringify(orders));
    }
    else if (requestData.type === 'confirm_order') {

      await Cart.findOneAndUpdate(
        { _id: requestData.order_id },
        { $set: {
          published: true
        } },
      );
    }
  });
});

if (process.env.NODE_ENV === 'production') {
  childProcess.exec('gcloud auth activate-service-account --key-file $GOOGLE_APPLICATION_CREDENTIALS');
}

export default app;
