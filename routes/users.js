const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/usuarios-Controller');

router.post('/', UsuariosController.postUsuario);
router.get('/', UsuariosController.getUsuarios);
router.get('/:id_usuario', UsuariosController.getUsuario);
router.patch('/', UsuariosController.pathUsuario);
router.delete('/', UsuariosController.deleteUsuario);
router.post('/login', UsuariosController.Login);

module.exports = router;