const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = 'uploads/';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ha nem létezik a könyvtár, akkor létrehozzuk
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Fájlnév módosítása: id és dátum alapján
        const now = new Date().toISOString().split('T')[0];
        cb(null, `${req.user.id}-${now}-${file.originalname}`);
    }
});

// Multer konfigurálása fájlszűrőkkel és fájlméret korlátozással
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: function (req, file, cb) {
        // A támogatott fájltípusok
        const filetypes = /jpeg|jpg|png|gif|webp|avif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        // Ha megfelel a fájl típus, akkor engedjük
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Csak képformátumban lehet feltölteni a jelmezeket'));
        }
    }
});

module.exports = upload;