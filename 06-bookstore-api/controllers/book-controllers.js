const Book = require('../models/book')

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        if (books.length > 0) {
            res.status(200).json({
                success: true,
                message: 'List of books fetched successfully',
                list: books
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'No book in collection'
            })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Try again"
        })
    }

}

const getBookByID = async (req, res) => {
    try {
        const ID = req.params.id;
        const reqBook = await Book.findById(ID);

        if (!reqBook) {
            return res.status(404).json({
                success: false,
                message: `No book with ID: ${ID}`
            });
        }

        res.status(200).json({
            'success': true,
            'message': `Book with ID ${ID}:`,
            'Book': reqBook
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Try again"
        })
    }

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
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Try again"
        })
    }

}

const updateBook = async (req, res) => {
    try {
        const ID = req.params.id;
        const formData = req.body;

        const updatedBook = await Book.findByIdAndUpdate(ID, formData, {new: true});

        if(!updatedBook){
            return res.status(404).json({
                success: false,
                message: `No book with ID: ${ID}`
            });
        }
        res.status(200).json({
            'success': true,
            'message': `Book with ID ${ID} updated successfully`,
            'Updated Book Details': updatedBook
        })


    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Try again"
        })
    }

}

const deleteBook = async (req, res) => {
    try {
        const ID = req.params.id;
        const reqBook = await Book.findByIdAndDelete(ID);

        if (!reqBook) {
            return res.status(404).json({
                success: false,
                message: `No book with ID: ${ID}`
            });
        }

        res.status(200).json({
            'success': true,
            'message': `Book with ID ${ID} deleted successfully`,
            'Deleted Book Details': reqBook
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Try again"
        })
    }

}





module.exports = {
    getAllBooks,
    getBookByID,
    addNewBook,
    updateBook,
    deleteBook
}