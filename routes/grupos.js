const express = require('express');
const router = express.Router();
const GruposController = require('../controllers/grupo-Controller');

router.post('/', GruposController.postGrupo);
router.get('/', GruposController.getGrupos);
router.get('/:id_grupo', GruposController.getGrupo);
router.patch('/', GruposController.patchGrupo);
router.delete('/:id_grupo', GruposController.deleteGrupo);

module.exports = router;