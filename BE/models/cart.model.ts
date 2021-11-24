import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/db';

export class Cart extends Model implements CartData {
  product_id!: string;
  product_name!: string;
  product_code!: string;
  product_description!: string;
  price!: number;
  quantity!: number;
  is_pushed!: boolean;

  constructor(...args: any) {
    super(...args);
  }

  static async $create(data: CartData) {
    return this.create(data);
  }

  static initialize() {
    Cart.init(
      {
        product_id: {
          type: DataTypes.STRING,
          allowNull: false
        },
        product_name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        product_code: {
          type: DataTypes.STRING,
          allowNull: false
        },
        product_description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1
        },
        is_pushed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
      },
      {
        sequelize,
        tableName: 'carts',
        name: {
          singular: 'cart',
          plural: 'carts'
        },
        paranoid: true
      }
    );
  }
}


interface CartData {
  product_id: string;
  product_name: string;
  product_code: string;
  product_description: string;
  price: number;
  quantity: number;
  is_pushed: boolean;
}