require('dotenv').config();

const express = require('express');
const connectToDB = require('./databse/db.js');
const bookRoutes = require('./routes/book-routes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

// Connect DB and start server
const startServer = async () => {
    try {
        await connectToDB();

        app.listen(PORT, () => {
            console.log(`Server is now running @ PORT ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();

