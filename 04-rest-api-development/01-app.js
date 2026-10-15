const express = require('express');
const app = express();

//middlewares
app.use(express.json());

let books = [
    {
        id: 1,
        title: 'Book 1',
        author: 'Author 1',
    },
    {
        id: 2,
        title: 'Book 2',
        author: 'Author 2',
    },
    {
        id: 3,
        title: 'Book 3',
        author: 'Author 1',
    },
    {
        id: 4,
        title: 'Book 4',
        author: 'Author 4',
    },
    {
        id: 5,
        title: 'Book 5',
        author: 'Author 2',
    },
    {
        id: 6,
        title: 'Book 6',
        author: 'Author 2',
    },
    {
        id: 7,
        title: 'Book 7',
        author: 'Author 3',
    },
    {
        id: 8,
        title: 'Book 8',
        author: 'Author 4',
    },
    {
        id: 9,
        title: 'Book 9',
        author: 'Author 2',
    },
    {
        id: 10,
        title: 'Book 10',
        author: 'Author 3',
    }
];

//routes
app.get('/', (req, res) => {
    res.send('Welcome to our book store');
});

app.get('/get', (req, res) => {
    res.json(books);
});

app.get('/get/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find((book) => book.id === id);

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

//Add a new book
app.post('/add', (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: `Book ${books.length + 1}`,
        author: `Author ${Math.floor(Math.random() * 4) + 1}`
    }

    books.push(newBook);

    res.status(200).json({ message: 'Book added successfully', book: newBook });
});

//Updating old entries
app.put('/update/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    const { title, author } = req.body;

    if (title !== undefined) {
        book.title = title;
    }

    if (author !== undefined) {
        book.author = author;
    }

    res.status(200).json({
        message: 'Book updated successfully',
        book
    });
});


// app.patch('/update/:id', (req, res) => {
//     const id = parseInt(req.params.id);
//     const book = books.find(book => book.id === id);

//     if (!book) {
//         return res.status(404).json({
//             message: 'Book not found'
//         });
//     }

//     Object.assign(book, req.body);

//     res.status(200).json({
//         message: 'Book updated successfully',
//         book
//     });
// });







// const PORT = 3000;

// app.listen(3000, () => {
//     console.log(`Server running at port: ${PORT}`);
// });

//Delete a book
app.delete('/delete/:id', (req, res) => {
    const currBook = books.find(book => book.id === parseInt(req.params.id));

    if (!currBook) {
        return res.status(404).json({ message: "Book not found" });
    }

    books = books.filter(book => book.id !== currBook.id);
    res.status(200).json({ message: "Book deleted successfully" });
})

// Another implementation of delete:

// app.delete('/delete/:id', (req, res) => {
//     const currBookIdx = books.findIndex(book => book.id === parseInt(req.params.id));

//     if(currBookIdx === -1){
//         return res.status(404).json({message: "Book not found"});
//     }

//     books.splice(currBookIdx, 1);
//     res.status(200).json({message: "Book deleted successfully"});
// })

app.listen(3000, () => {
    console.log(`Server running at port: 3000`);
});