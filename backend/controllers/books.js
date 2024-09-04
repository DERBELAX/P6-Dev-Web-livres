const Book = require('../models/book');
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

exports.createRating = async (req, res) => {
    try {
        // Extraire les données de la requête (ID utilisateur et note)
        const { userId, rating } = req.body
        // Trouver le livre correspondant à l'ID dans les paramètres de la requête
        const book = await Book.findById(req.params.id)

        // Vérifier si la requête contient une note
        if (!req.body) {
            return res
                .status(400)
                .json({ message: 'Votre requête ne contient aucune note !' })
        }

        // Vérifier si l'utilisateur a déjà noté ce livre
        if (book.ratings.some((rating) => rating.userId === userId)) {
            return res
                .status(400)
                .json({ message: 'Vous avez déjà noté ce livre !' })
        }

        // Ajouter la note à la liste des notes du livre et calculer la moyenne
        book.ratings.push({ userId: userId, grade: rating })
        const grades = book.ratings.map((rating) => rating.grade)
        const average =
            grades.reduce((total, grade) => total + grade, 0) / grades.length
        book.averageRating = parseFloat(average.toFixed(1))
        await book.save()

        // Envoyer une réponse avec le livre mis à jour
        res.status(200).json(book)
    } catch (error) {
        // Gérer les erreurs et renvoyer une réponse avec l'erreur
        console.error(error)
        res.status(500).json({ error })
    }
};
// Récupération des 3 meilleures notations //
exports.getbestrating = (req, res, next) => {
    Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};