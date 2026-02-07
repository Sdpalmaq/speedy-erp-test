const express = require('express');
const router = express.Router();
const BPartnerController = require('../controllers/BPartnerController');

// Define routes for BPartner
router.get('/bpartners', BPartnerController.getAllBPartners);
router.post('/bpartners', BPartnerController.createBPartner);
router.get('/bpartners/groups', BPartnerController.getGroups);

module.exports = router;