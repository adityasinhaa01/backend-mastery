console.log('SERVER FILE EXECUTED');
require('dotenv').config();
const connectDB = require('./database/db');
const express = require('express');

const app = express();





const startServer = async () => {
  try{

    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`Server started @PORT${process.env.PORT}`);
    })
  } catch(err) {
    console.error('Failed to start server: ', err);
    process.exit(1);
  }
}

startServer();