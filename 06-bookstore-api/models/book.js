const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true,
        maxLength: [100, 'Book title cannot be more than 100 characters']
    },
    author: {
        type: String,
        required: [true, 'Book author is required'],
        trim: true,
    },
    year: {
        type: Number,
        required: [true, 'Publication year is required'],
        max: [new Date().getFullYear(), 'Year cannot be in future']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Book", bookSchema);