const multer = require('multer');
const sharp = require('sharp');


const MINE_TYPE = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MINE_TYPE[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// configuration de l'upload des fichier avec multer
const upload = multer({
    storage: storage,
    fileFilter:(req, file, callback)=>{
        if(MINE_TYPE[file.mimetype]){
            callback(null, true)
        }else{
            callback(new Error('Type de fichier invalide'))
        }
    },
}).single('image')

const resizeImage = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    const filePath = req.file.path; // Utiliser req.file.path au lieu de req.file.filePath
    sharp(filePath)
        .resize({ width: 160, height: 260 })
        .toBuffer()
        .then((data) => {
            sharp(data)
                .toFile(filePath)
                .then(() => {
                    next();
                })
                .catch((error) => {
                    next(error);
                });
        })
        .catch((error) => {
            next(error);
        });
};

module.exports={
    upload,
    resizeImage
}

