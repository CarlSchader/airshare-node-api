require('dotenv').config();
const express = require('express');
const { query, validationResult } = require('express-validator');

const {uploadFile} = require('./object-storage/object-storage');

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

// TODO: see if you can specify all content-types with express.raw
// TODO: figure out how to do large files
function rawBodyMiddleWare(req, res, next) {
  return express.raw({type: req.header('content-type')})(req, res, next);
}

app.use('/api/file', rawBodyMiddleWare);

app.post(
  '/api/file',
  query('name').exists().isString().trim(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    uploadFile('test-user', req.query.name, req.body, () => res.sendStatus(200));
  }
);

app.listen(process.env.PORT, () => console.log(`serving on ${process.env.PORT}`));
