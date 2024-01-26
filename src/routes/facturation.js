const { Router } = require('express');
const router = Router();

const Facture = require('../models/facturation.js');

router.get('/',  async (req, res) => {
	const result = await Facture.find();
	res.json(result);
})

module.exports = router;