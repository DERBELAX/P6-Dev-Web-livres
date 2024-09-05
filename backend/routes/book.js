const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer=require('../middleware/multer-config');
const { upload, optimizeImage } = require('../middleware/multer-config');
const bookControllers = require('../controllers/books');

router.get('/bestrating', bookControllers.getbestrating);
router.post('/',auth, upload, optimizeImage, bookControllers.createBook);
router.post('/:id/rating',auth,  bookControllers.createRating);
router.put('/:id', auth, upload,optimizeImage, bookControllers.modifyBook);
router.delete('/:id',auth, bookControllers.deleteBook);
router.get('/', bookControllers.getAllBooks); 
router.get('/:id', bookControllers.getOneBook);



module.exports = router;



   



