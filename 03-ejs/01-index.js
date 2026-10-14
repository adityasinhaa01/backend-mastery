const express = require('express');
const path = require('path');
const { title } = require('process');

const app = express();

//set the view engine
app.set('view engine', 'ejs');

//set views directory
app.set('views', path.join(__dirname, 'views'));

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
];

app.get('/', (req, res) => {
    res.render('home', { title: 'Home', products: products });
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
