const Book = require('../models/bookModel');

// Render a new book from send the HTML form to the client (browser) so that the user can send the data
exports.addBook = async (req, res) => {
    try {
        res.render('./books/bookExchangeAddForm'); 
    } catch (err) {
        res.status(400).render('appError', { title: 'Add new Book', user: req.user, errors: err.errors });
    }
};

// CREATE a new book
exports.createBook = async (req, res) => {
    try {
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            exchangeType: req.body.exchangeType,
            owner: req.user._id,
            status: req.body.status,
            rating: req.body.rating // Add the rating field
        });
        const newBook = await book.save();
        res.redirect('/books');
    } catch (err) {
        res.status(400).render('appError', { title: 'Create Book', user: req.user, errors: err.errors });
    }
};

// READ GET all books
exports.getBooks = async (req, res) => {
    try {
        let filter = {};

        const filterType = req.query.filterType;
        const filterValue = req.query.filterValue;

        if (filterType && filterValue) {
            if (filterType === 'author' || filterType === 'title' || filterType === 'exchangeType' || filterType === 'status') {
                filter[filterType] = { $regex: new RegExp(filterValue, 'i') };
            } else if (filterType === 'rating') {
                // Handle rating filter
                const ratingValue = parseInt(filterValue, 10);
                if (!isNaN(ratingValue) && ratingValue >= 1 && ratingValue <= 5) {
                    filter[filterType] = ratingValue;
                } else {
                    return res.status(400).render('appError', { message: 'Invalid rating value' });
                }
            } else {
                return res.status(400).render('appError', { message: 'Invalid filter type' });
            }
        }

        const filteredBooks = await Book.find(filter);
        const allBooks = await Book.find();

        res.render('./books/bookListForm', { title: 'All Books', user: req.user, books: allBooks, filteredBooks, filter });
    } catch (err) {
        res.status(500).render('appError', { message: err.message });
    }
};

// GET a single book by ID
exports.getBookById = async (req, res) => {
    try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).render('error', { message: 'Book not found' });
            }
            res.render('./books/bookExchangeDetails', { book });
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
};


// UPDATE a book by ID
// Render a update book from send the HTML form to the client (browser) so that the user can send the data
exports.updateBookForm = async (req, res) => {
    try {
            const book = await Book.findById(req.params.id);
            console.log('Book ID from params:', req.params.id);  // Step 3

            if (!book) {
                console.log('Book not found');  // Step 5
                return res.status(404).json({ message: 'Book not found' });
            }
            
            console.log('Book found:', book);  // Step 4

            res.render('./books/bookExchangeDetails', {book:book}); 
    } catch (err) {
        res.status(400).render('appError', { title: 'Update Book', user: req.user, errors: err.errors });
    }
};

// exports.updateBookById = async (req, res) => {
//     try {
//       const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//       });
//       if (!book) {
//         return res.status(404).render("error", { message: "Book not found" });
//       }
//       const updatedBooks = await Book.find();
//       res.render(`./books/bookListForm`, {books: updatedBooks}); // Redirect to book detail page
//       //res.redirect(`/books/${req.params.id}`); // Redirect to book detail page
//     } catch (err) {
//         res.status(500).render('error', { message: err.message });
//     }
// };

exports.updateBookById = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!book) {
            return res.status(404).render("error", { message: "Book not found" });
        }

        // Fetch all books for unfiltered view
        const allBooks = await Book.find();

        res.render('./books/bookListForm', { books: allBooks, filteredBooks: [book] });
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
};

// DELETE a book by ID
exports.deleteBook = async (req, res) => {
    try {
            const book = await Book.findByIdAndRemove(req.params.id);
            if (!book) {
                return res.status(404).render('error', { message: 'Book not found' });
            }
            res.redirect('/books'); // Redirect to all books list
    } catch (err) {
        res.status(500).render('error', { message: err.message });
    }
};