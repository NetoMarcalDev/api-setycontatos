const express = require('express');
const router = express.Router();
const DddController = require('../controllers/ddd-Controller');

router.get('/', DddController.getDdds);




module.exports = router;