const express = require('express');
const router = express.Router();
const TiposAcessoController = require('../controllers/tipo-acesso-Controller');

router.post('/', TiposAcessoController.postTipoAcesso);
router.get('/', TiposAcessoController.getTiposAcesso);
router.get('/:id_tipo_acesso', TiposAcessoController.getTipoAcesso);
router.patch('/', TiposAcessoController.patchTipoAcesso);
router.delete('/', TiposAcessoController.deleteTipoAcesso);

module.exports = router;