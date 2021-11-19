import { Service } from './service';
import { Driver, CreateDriverDto, UpdateDriverDto } from '../interfaces/driver.interface';

export class DriverService extends Service {

    private static table: string = "drivers";

    constructor() {
        super();
    }


    static async findAll(): Promise<Driver[]> {
        return this.db( this.table ).select('*');
    }

    static async findById( id: number ): Promise<Driver> {
        return this.db( this.table ).first('*').where({id: id });
    }

    static async create( driver: CreateDriverDto ): Promise<Driver> {
        const response = await this.db( this.table ).insert( driver );
        return this.findById( response.pop() );
    }

    static async update( driverId: number, driver: UpdateDriverDto ): Promise<Driver> {
        await this.db( this.table ).update( driver ).where({id: driverId });
        return this.findById( driverId );
    }

    static async delete( driverId: number ): Promise<boolean> {
        try {
            await this.db( this.table ).delete( ).where({id: driverId });
            return true;
    
        } catch( err ) {
            console.log( err );
            return false;
        }

    }


}