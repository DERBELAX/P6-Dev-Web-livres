const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require ('../images/multer-config');

const bookControllers = require('../controllers/books');

router.get('/:id', bookControllers.getOneBook);
router.post('/',auth, multer, bookControllers.createBook);
router.put('/:id', auth, multer, bookControllers.modifyBook);
router.delete('/:id',auth, bookControllers.deleteBook);
router.get('/', bookControllers.getAllBooks); 
router.get('/:id/rating',auth, bookControllers.createRating);
router.get('/bestrating', bookControllers.getBestBooks);

module.exports = router;

   


