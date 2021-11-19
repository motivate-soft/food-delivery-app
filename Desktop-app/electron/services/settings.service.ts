import { Service } from './service';
import { Settings, UpdateSettingsDto } from '../interfaces/settings.interface';

export class SettingsService extends Service {

    private static table: string = "drivers";

    constructor() {
        super();
    }


    static async find(): Promise<Settings> {
        return this.db( this.table ).first('*');
    }

    static async update( settings: UpdateSettingsDto ): Promise<Settings> {
        await this.db( this.table ).update( settings );
        return this.find();
    }

}