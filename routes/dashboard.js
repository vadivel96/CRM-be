const express = require('express');
var router = express.Router();
const {dbUrl,dbName}=require('../config/dbConfig');

const mongoose=require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(dbUrl);

/* GET home page. */
router.get('/', function(req, res, next) {
  mongoose.connect(dbUrl);
  res.send('index', { title: 'Express' });
});

module.exports = router;