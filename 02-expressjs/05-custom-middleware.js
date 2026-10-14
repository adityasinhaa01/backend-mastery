const express = require('express');

const app = express();

//custom middleware

const requestLoggerMiddleware = (req, res, next) => {
    const timestamps = new Date().toISOString();
    console.log(`${timestamps} - ${req.method} - ${req.url} - ${req.ip}`);
    next();
}

//apply middleware to all routes

app.use(requestLoggerMiddleware);

app.get("/", (req, res) => {
    res.send("Welcome to our home page")
})

app.get("/products", (req, res) => {
    const products = [
        {
            "productName": "Laptop",
            "price": 999.99,
            "id": 1
        },
        {
            "productName": "Mouse",
            "price": 9.99,
            "id": 2
        },
        {
            "productName": "Keyboard",
            "price": 29.99,
            "id": 3
        },
    ]
    res.json(products)
})

//dynamic routes
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    const products = [
        {
            "productName": "Laptop",
            "price": 999.99,
            "id": 1
        },
        {
            "productName": "Mouse",
            "price": 9.99,
            "id": 2
        },
        {
            "productName": "Keyboard",
            "price": 29.99,
            "id": 3
        },
    ]

    const myProduct = products.find(product => product.id === productId);

    if (myProduct)
        res.json(myProduct);
    else
        res.status(404).send("Product Not found");

})

app.listen(3000, () => {
    console.log('server started')
})