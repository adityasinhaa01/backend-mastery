require('dotenv').config();
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const adminRoutes = require('./routes/admin-routes');
const authMiddleware = require('./middlewares/auth-middleware');
const adminMiddleware = require('./middlewares/admin-middleware');
const connectDB = require('./database/db');
const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/home', authMiddleware, homeRoutes);
app.use('/api/admin', authMiddleware, adminMiddleware, adminRoutes);


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