import mongoose from "mongoose";
import {MongoMemoryServer} from 'mongodb-memory-server';
import supertest from 'supertest';
import express, { Express } from 'express';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';
dotenv.config()

const MONGO_URI = process.env.MONGO_URI || '';

export class TestServer {
  public app: Express;
  public request: ReturnType<typeof supertest>;
  private mongoServer?: MongoMemoryServer;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.request = supertest(this.app);
  }

  async start() {
    this.mongoServer = await MongoMemoryServer.create();
    const uri = this.mongoServer.getUri();
    console.log("URI",uri);
    // await mongoose.connect(uri)
    await mongoose.connect(MONGO_URI)
    .then(
      () => {console.log("Connection to MongoDB")},
      err => {console.log('Failed to connect to MongoDB:', err)}
    );
  }

  async stop() {
    await mongoose.disconnect()
    if (this.mongoServer) await this.mongoServer.stop()
  }

  async cleanup() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key]
      if (collection) {
        await collection.deleteMany({});
      }
    }
  }

}
