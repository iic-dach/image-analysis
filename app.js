'use strict';
const path = require('path');

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const watsonRoutes = require('./routes/watson');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('imgUploader')
);
app.use(express.static(path.join(__dirname, 'public')));

app.use(watsonRoutes);

// error-handler settings
require('./config/error-handler')(app);

app.listen(port, function() {
  console.log('listening at:', port);
});
