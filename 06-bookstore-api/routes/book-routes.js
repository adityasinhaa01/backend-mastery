const express = require('express');
const { getAllBooks, getBookByID, addNewBook, updateBook, deleteBook } = require('../controllers/book-controllers')

const router = express.Router();

//all routes
router.get('/get', getAllBooks);
router.get('/get/:id', getBookByID);
router.post('/add', addNewBook);
router.put('/update/:id', updateBook);
router.delete('/delete/:id', deleteBook);

module.exports = router;