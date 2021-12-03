require('dotenv').config()

import app from './app';
import { io } from './io';
import connectDB from "./config/database";
import { createServer } from "http";

const port = process.env.PORT || '3000';

export async function startServer() {
    try {
        await connectDB();
        const httpServer = createServer(app);
        io(httpServer);
        httpServer.listen(port, (): void => { 
            console.info(`
                ################################################
                🛡️  Server listening on port: ${port} 🛡️
                ################################################
            `);
        });
    } catch (error) {
        console.error(`Error occured: ${error}`);
    }
  }

startServer();