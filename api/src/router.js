const express = require('express');
const multer = require('multer');
const path = require('path');

const imageProcessor = require('./imageProcessor');

const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

const router = express.Router();

const filename = (request, file, callback) => {
  callback(null, file.originalname);
};
const storage = multer.diskStorage({
  destination: 'api/uploads/',
  filename: filename,
});

const fileFilter = (request, file, callback) => {
  if (file.mimetype !== 'image/png') {
    request.fileValidationError = 'Wrong file type';
    callback(null, false, new Error('Wrong file type'));
  } else {
    callback(null, true);
  }
};

const upload = multer({
  fileFilter: fileFilter,
  storage: storage,
});

router.post('/upload', upload.single('photo'), async (request, response) => {
  try {
    await imageProcessor(request.file.filename);
  } catch (error) {}
  if (request.fileValidationError) {
    return response.status(400).json({ error: request.fileValidationError });
  }
  return response.status(201).json({ success: true });
});

router.get('/photo-viewer', async (request, response) => {
  response.sendFile(photoPath);
});

module.exports = router;
