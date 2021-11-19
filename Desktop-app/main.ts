import { app, BrowserWindow, screen, ipcMain, Notification } from "electron";
import { PosPrintData } from "electron-pos-printer";

import * as path from "path";
import * as url from "url";

import { CustomerService } from "./electron/services/customer.service";
import { OrderService } from "./electron/services/order.service";
import { DriverService } from "./electron/services/driver.service";
import { SettingsService } from "./electron/services/settings.service";

import { CreateOrderDto } from "./electron/interfaces/order.interface";

import Printer from "./electron/printer";

let win: BrowserWindow = null;

// tslint:disable-next-line: typedef
const args = process.argv.slice(1),
      // tslint:disable-next-line: typedef
      serve = args.some(val => val === "--serve");

function createWindow(): BrowserWindow {

  // tslint:disable-next-line: typedef
  const electronScreen = screen;
  // tslint:disable-next-line: typedef
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
      contextIsolation: false,  // false if you want to run 2e2 test with Spectron
      enableRemoteModule : true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
    },
  });

  if (serve) {

    win.webContents.openDevTools();

    require("electron-reload")(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL("http://localhost:4200");

  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, "dist/index.html"),
      protocol: "file:",
      slashes: true
    }));
  }

  // emitted when the window is closed.
  win.on("closed", () => {
    // dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // this method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // some APIs can only be used after this event occurs.
  // tslint:disable-next-line: max-line-length
  // added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on("ready", () => setTimeout(createWindow, 400));

  // quit when all windows are closed.
  app.on("window-all-closed", () => {
    // on OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // on OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on("customer:findAll", async (event) => {
    // tslint:disable-next-line: typedef
    const customers = await CustomerService.findAll();

    event.sender.send("customer:findAll:response", customers );
  });

  ipcMain.on("customer:create", async (event, _customer ) => {
    // tslint:disable-next-line: typedef
    const customer = await CustomerService.create( _customer );
    event.sender.send("customer:create:response", customer );
  });

  ipcMain.on("customer:update", async (event, _customer ) => {
    // tslint:disable-next-line: typedef
    const customer = await CustomerService.update( _customer.id, _customer );
    // tslint:disable-next-line: typedef
    const customers = await CustomerService.findAll();
    event.sender.send("customer:findAll:response", customers );
  });

  ipcMain.on("customer:delete", async (event, _customerId) => {
    await CustomerService.delete(_customerId);
    // tslint:disable-next-line: typedef
    const customers = await CustomerService.findAll();
    event.sender.send("customer:findAll:response", customers );
  });

  ipcMain.on("order:findAll", async (event) => {
    // tslint:disable-next-line: typedef
    const orders = await OrderService.findAll();
    event.sender.send("order:findAll:response", orders );
  });

  ipcMain.on("driver:findAll", async (event) => {
    // tslint:disable-next-line: typedef
    const drivers = await DriverService.findAll();
    event.sender.send("driver:findAll:response", drivers );
  });

  ipcMain.on("settings:findAll", async (event) => {
    // tslint:disable-next-line: typedef
    const settings = await SettingsService.find();
    event.sender.send("settings:findAll:response", settings );
  });

  ipcMain.on("order:print", async (event, { cart, address }) => {
    if (!address) {
      showNotification("Invalid Address", "Please input the address.");
      event.sender.send("order:printed", { message: `Failed! Invalid address`, error: true });
      return;
    } else {
      if (address.name === "" || address.street === "" || address.city === "" || address.telephone === "" || address.remarks === "") {
        showNotification("Invalid Address", "Please fill out the address.");
        event.sender.send("order:printed", { message: `Failed! Invalid address`, error: true });
        return;
      }
    }

    if (!cart || Object.assign(cart, Array).length === 0) {
      showNotification("Invalid Cart", "Please fill out the cart.");
      event.sender.send("order:printed", { message: `Failed! Invalid cart`, error: true });
      return;
    }

    const order: CreateOrderDto = { ...address, order_items: cart };

    // tslint:disable-next-line: typedef
    const order_id = await OrderService.create( order );

    // tslint:disable-next-line: typedef
    const _order = cart.map( cartItem => {
      return [ `${cartItem.quantity}`, `${cartItem.size}`, `${cartItem.code} - ${cartItem.name}`, `${cartItem.price * cartItem.quantity}`, `${Math.floor(cartItem.price * cartItem.quantity * (1 + cartItem.tax / 100) * 1000) / 1000 }(${cartItem.tax}%)` ];
    });

    const data: PosPrintData[] = [

      {
        type: "text",
        value: address.name,
        style: `text-align:center;`,
        css: {"font-weight": "500", "font-size": "16px"}
      },
      {
        type: "text",
        value: address.street,
        style: `text-align:center;`,
        css: {"font-weight": "300", "font-size": "15px"}
      },
      {
        type: "text",
        value: address.city,
        style: `text-align:center;`,
        css: {"font-weight": "300", "font-size": "15px"}
      },
      {
        type: "text",
        value: address.telephone,
        style: `text-align:center;`,
        css: {"font-weight": "300", "font-size": "15px"}
      },
     {
      type: "table",

      // style the table
      style: "font-size: 10px;font-family:Calibri;margin-top: 10px; width: 100%;",

      tableHeader: ["Anz", "Gr", "Artikel", "Preis", "VAT(Tax%)"],

      tableBody: _order,

   },
  ];

    Printer.print( data );

    showNotification("Notice:", "Printed successfully.");
    event.sender.send("order:printed", { message: `Order ${order_id} Created successfully!`});
  });

} catch (e) {
   throw e;
}

function showNotification (title_content: any, body_content: any): void {
  new Notification({ title: title_content, body: body_content }).show();
}
