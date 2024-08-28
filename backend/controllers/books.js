const { error } = require('console');
const Book = require('../models/Book');
const fs =require('fs');
const path = require('path');


// Create a new book
exports.createBook = async (req, res, next) => {
    try {
        const bookObject = JSON.parse(req.body.book);
        delete bookObject._id;
        delete bookObject._userId;

        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null
        });

        await book.save();
        res.status(201).json({ message: 'Object saved!' });
    } catch (error) {res.status(400).json({ error });}
};

// Modify an existing book
exports.modifyBook = (req, res, next) => {
    // Construct the updated book object
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          }
        : { ...req.body };

    delete bookObject.userId;

    // Find the book by ID
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Check if the user is authorized to modify the book
            if (book.userId != req.auth.userId) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            // Update the book
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet modifié' }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(400).json({ error }));
};




exports.deleteBook = (req, res, next) => {
    // Find the book by ID
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // Check if the user is authorized to delete the book
            if (book.userId != req.auth.userId) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            // Extract the filename from the image URL
            const filename = book.imageUrl.split('/images/')[1];

            // Delete the image file
            fs.unlink(path.join('images', filename), (error) => {
                if (error) {
                    return res.status(500).json({ error });
                }

                // Delete the book from the database
                Book.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé' }))
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(400).json({ error }));
};


// Get one book by ID
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

// Get all books
exports.getAllBooks = (req, res, next) => {
    Thing.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};
