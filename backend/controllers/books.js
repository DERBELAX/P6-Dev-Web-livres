const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

// Création d'un livre //
exports.createBook = (req, res, next) => {
    let bookObject;
    
    try {
        bookObject = JSON.parse(req.body.book);
    } catch (error) {
        if (req.file) {
            fs.unlink(`images/${req.file.filename}`, () => {});
        }
        return res.status(400).json({ message: 'Invalid JSON data in request body' });
    }

    delete bookObject._id;
    delete bookObject._userId;

    if (!req.file || !req.file.filename) {
        return res.status(400).json({ message: 'Image file is missing' });
    }

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch(error => { 
            if (req.file) {
                fs.unlink(`images/${req.file.filename}`, () => {});
            }
            res.status(500).json({ error: 'Failed to save the book' });
        });
};
// Modification d'un livre //
exports.modifyBook = (req, res, next) => {
    let updateBook;
    
    try {
        updateBook = req.file ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
        } : { ...req.body };

        delete updateBook._userId; 
    } catch (error) {
        if (req.file) {
            fs.unlink(`images/${req.file.filename}`, () => {});
        }
        return res.status(400).json({ message: 'Invalid data format' });
    }
    
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: 'Unauthorized!' });
            } else {
                if (req.file) {
                    const oldImageName = book.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${oldImageName}`, (err) => {
                        if (err) console.error('Error deleting old image:', err);
                    });
                }

                Book.updateOne({ _id: req.params.id }, { ...updateBook, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                    .catch(error => res.status(400).json({ error: 'Failed to update the book' }));
            }
        })
        .catch(error => res.status(400).json({ error: 'Book not found' }));
};
// Suppression d'un livre //
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                return res.status(403).json({ message: 'Unauthorized!' });
            }

            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, (err) => {
                if (err) console.error('Error deleting image:', err);

                Book.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre Supprimé !' }))
                    .catch(error => res.status(500).json({ error: 'Failed to delete the book' }));
            });
        })
        .catch(error => res.status(500).json({ error: 'Failed to retrieve the book' }));
};
// Récupération d'un livre //
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.status(200).json(book);
        })
        .catch(error => res.status(500).json({ error: 'Failed to retrieve the book' }));
};
// Récupération de tous les livres //
exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => {
            if (!books || books.length === 0) {
                return res.status(404).json({ message: 'No books found' });
            }
            res.status(200).json(books);
        })
        .catch(error => res.status(500).json({ error: 'Failed to retrieve books' }));
};


