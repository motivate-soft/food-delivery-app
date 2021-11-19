import { Service } from './service';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../interfaces/customer.interface';
export class CustomerService extends Service {

    private static table: string = "customers";

    constructor() {
        super();
    }


    static async findAll(): Promise<Customer[]> {
        return this.db( this.table ).select('*');
    }

    static async findById( id: number ): Promise<Customer> {
        return this.db( this.table ).first('*').where({id: id });
    }

    static async create( customer: CreateCustomerDto ): Promise<Customer> {
        const response = await this.db( this.table ).insert( customer );
        return this.findById( response.pop() );
    }

    static async update( customerId: number, customer: UpdateCustomerDto ): Promise<Customer> {
        await this.db( this.table ).update( customer ).where({id: customerId });
        return this.findById( customerId );
    }

    static async delete( customerId: number ): Promise<boolean> {
        try {
            await this.db( this.table ).delete( ).where({id: customerId });
            return true;
    
        } catch( err ) {
            console.log( err );
            return false;
        }

    }


}