const express = require('express');

const app = express();

//routing

app.post('/api/data', (req, res) => {
    res.json({
        message: 'Data Recieved',
        data: req.body
    })
})

//error handling middleware

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Something went wrong')
})

app.listen(3000, () => {
    console.log('server started on port 3000')
})