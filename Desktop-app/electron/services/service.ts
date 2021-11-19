import * as knex from 'knex';
import * as path from 'path';

export class Service {
    protected static db = knex({
        client: 'sqlite3',
        connection: {
          filename: path.join(__dirname, '..', 'azzip.sqlite3')
        },
        useNullAsDefault: true
    }).on('query', function( query: any ) {
        console.log( `Query => ${query.sql}, Bindings =>  ${query.bindings}`);
    });

    constructor() {
      console.log( path.join(__dirname, 'azzip.sqlite3') );
    }

    
}

