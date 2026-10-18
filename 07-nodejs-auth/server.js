console.log('SERVER FILE EXECUTED');
require('dotenv').config();
const router = require('./routes/auth-routes')
const connectDB = require('./database/db');
const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/auth', router);



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