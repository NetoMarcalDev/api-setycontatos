const express = require('express');
const router = express.Router();
const ContatosController = require('../controllers/contatos-Controller');

router.post('/', ContatosController.postContato);
router.get('/', ContatosController.getContatos);
router.get('/lista', ContatosController.getContatosLista);

router.get('/:id_contato', ContatosController.getTelefones);
router.delete('/delete/:id_contato', ContatosController.deleteContato);
router.delete('/:id_contato', ContatosController.deleteContatos);
router.patch('/', ContatosController.patchContato);

module.exports = router;