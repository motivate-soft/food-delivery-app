import mongoose from "mongoose";
require('dotenv').config()

import app from './app';

const port = process.env.PORT || '3000';

const uri: string = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const options = { useNewUrlParser: true, useUnifiedTopology: true }

export async function startServer() {
    try {
        // await initDatabase();
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