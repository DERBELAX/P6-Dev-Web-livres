const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, resizeImage } = require('../images/multer-config')
const bookControllers = require('../controllers/books');

router.get('/bestrating', bookControllers.getbestrating);
router.post('/',auth, upload, resizeImage, bookControllers.createBook);
router.post('/:id/rating',auth,  bookControllers.createRating);
router.put('/:id', auth, upload,resizeImage, bookControllers.modifyBook);
router.delete('/:id',auth, bookControllers.deleteBook);
router.get('/', bookControllers.getAllBooks); 
router.get('/:id', bookControllers.getOneBook);



module.exports = router;



   



