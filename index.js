require('dotenv').config();
const express = require('express');
const { query, validationResult } = require('express-validator');

const {uploadFile, retrieveFile} = require('./object-storage/object-storage');

process.env.PORT = process.env.PORT || 8080; 

const app = express();

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(req.originalUrl);
    console.log(req.headers);
    next();
  });
}

app.get('/', (req, res)  => res.sendStatus(200));

app.get('/api/file/:userId/:fileName', retrieveFile);

app.post(
  '/api/file',
  query('fileName').exists().isString().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  express.raw({
    type: '*/*',
    limit: process.env.FILE_SIZE_LIMIT,
  }),
  uploadFile,
);

app.listen(process.env.PORT, () => console.log(`serving on ${process.env.PORT}`));
