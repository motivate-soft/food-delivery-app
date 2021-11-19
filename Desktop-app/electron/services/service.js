"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
var knex = require("knex");
var path = require("path");
var Service = /** @class */ (function () {
    function Service() {
        console.log(path.join(__dirname, 'azzip.sqlite3'));
    }
    Service.db = knex({
        client: 'sqlite3',
        connection: {
            filename: path.join(__dirname, '..', 'azzip.sqlite3')
        },
        useNullAsDefault: true
    }).on('query', function (query) {
        console.log("Query => " + query.sql + ", Bindings =>  " + query.bindings);
    });
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=service.js.map