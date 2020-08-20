const express = require('express');
const router = express.Router();
const EmailsController = require('../controllers/email-Controller');

router.post('/', EmailsController.postEmail);
router.get('/', EmailsController.getEmails);
router.get('/:id_contato', EmailsController.getEmailContato);
router.patch('/', EmailsController.patchEmail);
router.delete('/', EmailsController.deleteEmail);

module.exports = router;