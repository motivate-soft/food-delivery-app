import { Document, Model, model, Schema } from "mongoose";

export interface ITopping {
  _id: string;
  name: string;
  price: number;
  size: string;
}

export interface CartItem {
  shop_id: string;
  product_id: string;
  product_code: string;
  product_description: string;
  product_name: string;
  price: number;
  quantity: number;
  toppings?: ITopping[];
}

export interface ICart extends Document {
  shop_id: string;
  carts: Array<CartItem>;
  request_date: string;
  published: boolean;
}

const CartSchema: Schema = new Schema({
  shop_id: {
    type: String,
    required: true,
  },
  carts: [
    {
      shop_id: {
        type: String,
        required: true,
      },
      product_id: {
        type: String,
        required: true
      },
      product_description: {
        type: String
      },
      product_name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number
      },
      toppings: {
        type: [
          {
            _id: String,
            name: String,
            price: Number,
            size: String
          }
        ]
      }
    }
  ],
  published: {
    type: Boolean,
    default: false
  },
  request_date: {
    type: Date,
    default: Date.now
  }
});

const Cart: Model<ICart> = model("Cart", CartSchema);

export default Cart;
