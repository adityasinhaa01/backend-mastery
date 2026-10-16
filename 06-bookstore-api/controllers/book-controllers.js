const Book = require('../models/book')

const getAllBooks = async (req, res) => {
    try{
        const books = await Book.find({});
        if(books.length > 0){
            res.status(200).json({
                success: true,
                message: 'List of books fetched successfully',
                list: books
            })
        }else{
            res.status(404).json({
                success: false,
                message: 'No book in collection'
            })
        }
    } catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Try again"
        })
    }

}

const getBookByID = async (req, res) => {


}

const addNewBook = async (req, res) => {
    try {
        const newBook = req.body;
        const newlyCreatedBook = await Book.create(newBook);

        if (newlyCreatedBook) {
            res.status(201).json({
                status: true,
                message: "Book created successfully",
                book: newlyCreatedBook
            })
        }
    } catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Try again"
        })
    }

}

const updateBook = async (req, res) => {


}

const deleteBook = async (req, res) => {


}





module.exports = {
    getAllBooks,
    getBookByID,
    addNewBook,
    updateBook,
    deleteBook
}