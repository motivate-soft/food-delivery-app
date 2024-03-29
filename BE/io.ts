import http from "http";
import { Server, Socket } from "socket.io";
import { SocketShop } from "./models/Socket";
import Cart from "./models/Cart";

const shops: SocketShop[] = [];

export function io(httpServer: http.Server) {

    const io = new Server(httpServer, { 
        path: '/order',
        cors: {
            origin: ["http://localhost:4200", "http://localhost:4202"],
            methods: ["GET", "POST"]
          }
    });
      
    io.on("connection", (socket: Socket) => {
        
        socket.join('order-room');

        socket.on('order:shopId', async (data: any) => {
            if (data.shopId) {
                const shop: SocketShop = { shopId: data.shopId, id: socket.id };
                let existing = searchShop(shop.shopId);
                
                if (existing === false) {
                    shops.push(shop);
                }
                else {
                    let existingShop = searchShop(data.shopId);
                    if (existingShop !== false) {
                        shops.splice(shops.indexOf(existingShop), 1);
                        shops.push(shop);
                    }
                }

                const orders = await Cart.findOne({ shop_id: data.shopId, published: false });
                for (let i = 0; i < shops.length; i++) {
                    if (shops[i].shopId === data.shopId) {
                        io.to(shops[i].id).emit('order:data', JSON.stringify(orders));
                    }
                }
            }
        });

        socket.on('order:print', async (data: any) => {
            if (data.shopId) {
                const orders = await Cart.findOne({ shop_id: data.shopId, published: false });
                for (let i = 0; i < shops.length; i++) {
                    if (shops[i].shopId === data.shopId) {
                        io.to(shops[i].id).emit('order:data', JSON.stringify(orders));
                    }
                }
            }
        });

        socket.on('order:printed', async (data: any) => {
            if (data.orderId) {
                await Cart.findOneAndUpdate(
                            { _id: data.orderId },
                            { $set: {
                                published: true
                                } 
                            },
                        );
                io.emit('order:printed', 'published');
            }
        });

        socket.on('order:total', async (data: any) => {
            if (data.shopId) {
                const orders = await Cart.find({ shop_id: data.shopId }, null, { sort: {request_date: -1}, limit: 50 });

                io.emit('order:online', JSON.stringify(orders));
            }
        });

        socket.on('disconnect', (data: any) => {
            let existingShop = searchShop(data.shopId);
            if (existingShop !== false) {
                shops.splice(shops.indexOf(existingShop), 1);
            }
            io.emit('disconnected', 'successfully disconnected');
        });

      });
}

function searchShop(shopId: string) {
    for (let i = 0; i < shops.length; i++) {
        if (shops[i].shopId === shopId) {
            return shops[i];
        }
    }
    return false;
}