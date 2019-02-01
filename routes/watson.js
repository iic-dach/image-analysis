const express = require('express');

const watsonController = require('../controllers/watson');

const router = express.Router();

router.post('/recognize', watsonController.recognize);

router.post('/translate', watsonController.translate);

router.post('/speak', watsonController.speak);

module.exports = router;