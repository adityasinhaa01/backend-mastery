const express = require('express');

const app = express();

//define middleware function

// const myFirstMiddleware = (req, res, next) => {                      |  
//     console.log("this middleware will run on all requests");         |  
//     next();                                                          |  syntax 1
// }                                                                    |  
//                                                                      |
// app.use(myFirstMiddleware);                                          |

// define middleware function that runs on every request
app.use((req, res, next) => {
    console.log("this middleware will run on all requests");
    next();
})

app.get('/', (req, res) => {
    res.send('this is the home page')
});

app.get('/about', (req, res) => {
    res.send('this is the about page')
});

app.listen(3000, () => {
    console.log('server started on port 3000');
})