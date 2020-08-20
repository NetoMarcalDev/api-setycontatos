const express = require('express');
const router = express.Router();
const TiposEmailController = require('../controllers/tipo-email-Controller');
const login = require('../middleware/login');

router.post('/', TiposEmailController.postTipoEmail);
router.get('/', TiposEmailController.getTiposEmail);
router.get('/:id_tipo_email', TiposEmailController.getTipoEmail);
router.patch('/', TiposEmailController.patchTipoEmail);
router.delete('/', login, TiposEmailController.deleteTipoEmail);

module.exports = router;