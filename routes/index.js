const express = require("express");
const indexController = require('../controllers/index');
const indexRouter = express.Router();

const multer = require('multer');
const upload = multer({dest: 'tmp/csv/'}).single('file');

indexRouter.post('/upload', upload, indexController.importAccounts);

indexRouter.get('/get', indexController.getAccounts);

indexRouter.get('/export', indexController.exportAccounts);

module.exports = indexRouter;