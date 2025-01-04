import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fungsi untuk membuat direktori jika belum ada
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const publicPath = path.join(__dirname, '../../public');
    const coversPath = path.join(publicPath, 'covers');
    const booksPath = path.join(publicPath, 'books');

    // Buat direktori jika belum ada
    ensureDirectoryExists(publicPath);
    ensureDirectoryExists(coversPath);
    ensureDirectoryExists(booksPath);

    if (file.fieldname === "coverImage") {
      cb(null, coversPath);
    } else if (file.fieldname === "epubFile") {
      cb(null, booksPath);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "coverImage") {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('File harus berupa gambar!'), false);
    }
  } else if (file.fieldname === "epubFile") {
    cb(null, true);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
}); 