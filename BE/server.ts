import express from "express";

require('dotenv').config()

import app from './app';

const port = process.env.PORT || '3000';


export async function startServer() {
    try {
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