import {PosPrinter, PosPrintData, PosPrintOptions} from "electron-pos-printer";


export class Printer {

    private printOptions: PosPrintOptions = {
        preview: true,
        width: "80mm",
        margin: "0 0 0 0",
        copies: 1,
        printerName: "DLP80U-04",
        timeOutPerLine: 400,
    };

    // 80mm DESK usb thermal label printer DLP80U-04

    constructor( options?: PosPrintOptions ) {
        this.printOptions = Object.assign({}, this.printOptions, options );
    }

    // tslint:disable-next-line: typedef
    async print( data: PosPrintData[] ) {
        try {
            await PosPrinter.print(data,  this.printOptions );
        } catch (error) {
            throw error;
        }
    }
}

export default new Printer();