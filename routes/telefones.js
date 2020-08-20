const express = require('express');
const router = express.Router();
const TelefonesController = require('../controllers/telefone-Controller');

router.post('/', TelefonesController.postTelefone);
router.get('/', TelefonesController.getTelefones);
router.get('/:numero', TelefonesController.getTelefone);
router.patch('/', TelefonesController.patchTelefone);
router.delete('/', TelefonesController.deleteTelefone);

module.exports = router;