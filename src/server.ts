// import express from 'express';
import { connectDB } from './utils/db';
import app from './app';

// const app = express();

const start = async() => {
  await connectDB();
  app.listen(3000, ()=>{
    console.log("Server is runninng");
  });
}

start();

