import * as express from 'express';
import services from './services.route';
import serviceShopRoute from './service-shop.route';

export default () => {
  const router = express.Router();
  services(router);
  router.use('/shop', serviceShopRoute());
  router.get('/ping', (req, res) => res.send('pong'));
  return router;
};
