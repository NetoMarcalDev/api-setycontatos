const express = require('express');
const router = express.Router();
const HistoricosController = require('../controllers/historico-Controller');

router.post('/', HistoricosController.postHistorico);
router.get('/', HistoricosController.getHistoricos);
router.get('/:id_historico', HistoricosController.getHistorico);
router.patch('/', HistoricosController.patchHistorico);
router.delete('/', HistoricosController.deleteTipoTelefone);

module.exports = router;