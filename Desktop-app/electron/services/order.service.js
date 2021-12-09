"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
var ramda_1 = require("ramda");
var service_1 = require("./service");
var OrderService = /** @class */ (function (_super) {
    __extends(OrderService, _super);
    function OrderService() {
        return _super.call(this) || this;
    }
    OrderService.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var orders, orderIds, orderItems, responseGrouped;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db(this.table).select("*")];
                    case 1:
                        orders = _a.sent();
                        orderIds = orders.map(function (order) { return order.id; });
                        return [4 /*yield*/, this.db("order_items ").select("*").whereIn("order_id", orderIds)];
                    case 2:
                        orderItems = _a.sent();
                        responseGrouped = ramda_1.groupBy(function (orderItem) { return orderItem.order_id; }, orderItems);
                        return [2 /*return*/, orders.map(function (order) {
                                order.order_items = responseGrouped[order.id];
                                return order;
                            })];
                }
            });
        });
    };
    OrderService.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var order, orderItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db(this.table).first("*").where({ id: id })];
                    case 1:
                        order = _a.sent();
                        return [4 /*yield*/, this.db("order_items ").select("*").where("order_id", id)];
                    case 2:
                        orderItems = _a.sent();
                        order.order_items = orderItems;
                        return [2 /*return*/, order];
                }
            });
        });
    };
    OrderService.create = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var order_items, response, orderId, updated_items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        order_items = __spreadArrays(order.order_items);
                        delete order.order_items;
                        return [4 /*yield*/, this.db(this.table).insert(order)];
                    case 1:
                        response = _a.sent();
                        orderId = response.pop();
                        updated_items = [];
                        order_items.forEach(function (element) {
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
                        return [4 /*yield*/, this.db("order_items").insert(updated_items)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.findById(orderId)];
                }
            });
        });
    };
    OrderService.update = function (orderId, customer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db(this.table).update(customer).where({ id: orderId })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.findById(orderId)];
                }
            });
        });
    };
    OrderService.delete = function (orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db(this.table).delete().where({ id: orderId })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.deleteAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.db(this.table).delete()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    OrderService.table = "orders";
    return OrderService;
}(service_1.Service));
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map