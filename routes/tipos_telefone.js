const express = require('express');
const router = express.Router();
const TiposTelefoneController = require('../controllers/tipo-telefone-Controller');

router.post('/', TiposTelefoneController.postTipoTelefone);
router.get('/', TiposTelefoneController.getTiposTelefone);
router.get('/:id_tipo_telefone', TiposTelefoneController.getTipoTelefone);
router.patch('/', TiposTelefoneController.patchTipoTelefone);
router.delete('/', TiposTelefoneController.deleteTipoTelefone);

module.exports = router;