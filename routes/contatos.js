const express = require('express');
const router = express.Router();
const ContatosController = require('../controllers/contatos-Controller');

router.post('/', ContatosController.postContato);
router.get('/', ContatosController.getContatos);
router.get('/:id_contato', ContatosController.getTelefones);

module.exports = router;