import { map, groupBy} from "ramda";
import { Service } from "./service";
import { OrderItem, Order, CreateOrderDto, UpdateOrderDto } from "../interfaces/order.interface";

export class OrderService extends Service {
    private static table: string = "orders";

    constructor() {
        super();
    }

    static async findAll(): Promise<Order[]> {
        const orders: Order[] = await this.db( this.table ).select("*");
        const orderIds = orders.map( order => order.id );
        const orderItems: OrderItem[] = await this.db( "order_items ").select("*").whereIn( "order_id", orderIds );
        const responseGrouped = groupBy( ( orderItem: OrderItem ) => orderItem.order_id, orderItems );
        
        return orders.map( order => {
            order.order_items = responseGrouped[order.id];
            return order;
        });
    }

    static async findById( id: number ): Promise<Order> {
        const order: Order = await this.db( this.table ).first("*").where({id: id });
        const orderItems: OrderItem[] = await this.db( "order_items ").select("*").where( "order_id", id );
        order.order_items = orderItems;

        return order;
    }

    static async create( order: CreateOrderDto ): Promise<Order> {

        let order_items = [ ...order.order_items ];

        delete order.order_items;

        const response = await this.db( this.table ).insert( order );
        const orderId = response.pop();

        // let order_items_1 = order_items.map( order_item => {
        //     order_item.order_id = orderId;
        //     return order_item;
        // });
        // tslint:disable-next-line: typedef
        let updated_items = [];
        order_items.forEach(element => {
            // tslint:disable-next-line: no-string-literal
            element["order_id"] = orderId;
            // tslint:disable-next-line: no-string-literal
            element["product_id"] = element["_id"];
            // tslint:disable-next-line: no-string-literal
            element["topping"] = JSON.stringify(element["toppings"]);

            // tslint:disable-next-line: no-string-literal
            element["tax"] = element["tax"] ? element["tax"] : 7;
            // tslint:disable-next-line: no-string-literal
            delete element["_id"];
            // tslint:disable-next-line: no-string-literal
            delete element["toppings"];
            updated_items.push(element);
        });

        await this.db( "order_items" ).insert( updated_items );

        return this.findById( orderId );
    }

    static async update( orderId: number, customer: UpdateOrderDto ): Promise<Order> {
        await this.db( this.table ).update( customer ).where({id: orderId });
        return this.findById( orderId );
    }

    static async delete( orderId: number ): Promise<boolean> {
        try {
            await this.db( this.table ).delete( ).where({id: orderId });
            return true;
    
        } catch( err ) {
            console.log( err );
            return false;
        }
    }

    static async deleteAll( ): Promise<boolean> {
        try {
            await this.db( this.table ).delete();
            return true;
    
        } catch( err ) {
            console.log( err );
            return false;
        }
    }

}