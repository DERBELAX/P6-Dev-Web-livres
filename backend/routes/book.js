const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require ('../images/multer-config');

const bookControllers = require('../controllers/books');

router.get('/bestrating', bookControllers.getbestrating);
router.post('/',auth, multer, bookControllers.createBook);
router.post('/:id/rating',auth, bookControllers.createRating);
router.put('/:id', auth, multer, bookControllers.modifyBook);
router.delete('/:id',auth, bookControllers.deleteBook);
router.get('/', bookControllers.getAllBooks); 
router.get('/:id', bookControllers.getOneBook);



module.exports = router;



   



