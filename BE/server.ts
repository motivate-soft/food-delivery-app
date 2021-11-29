require('dotenv').config()

import app from './app';
import connectDB from "./config/database";

const port = process.env.PORT || '3000';

export async function startServer() {
    try {
        await connectDB();
        app.listen(port, (): void => { 
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