const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require ('../images/multer-config');

const bookControllers = require('../controllers/books');

router.get('/:id',auth, bookControllers.getOneBook);
router.post('/',auth, multer, bookControllers.createBook);
router.put('/:id', auth, multer, bookControllers.modifyBook);
router.delete('/:id',auth, bookControllers.deleteBook);
router.get('/', auth, bookControllers.getAllBooks); 

module.exports = router;

   


