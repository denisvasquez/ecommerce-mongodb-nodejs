const { Router } = require('express');
const router = Router();
const { v4: uuidv4 } = require('uuid');

const buysUsers = require('../models/buysUsers.js');
const Products = require('../models/products.js');
const register = require('../models/register.js');

router.get('/buy', async (req, res) => {
	const result = await Products.find();
	res.render('users/buyUser.hbs', { result })
});

router.post('/buy/:id', Auth, async (req, res) => {
	const result = await Products.findById(req.params.id);

	if (result.amount !== 0) {
		if (req.body.amount >= 1) {
			if (Number(req.body.amount) <= Number(result.amount)) {
				const updateValue = {
					amount: Number(result.amount) - Number(req.body.amount)
				};
				Object.assign(result, updateValue);
				await result.save();
				res.redirect('/register');
			} else {
				if (Number(req.body.amount) > Number(result.amount)) {
					res.render('users/preview.hbs', { result, alert: 'No existe esa cantidad de productos disponibles' });
				};
			};
		} else {
			if (req.body.amount < 1) {
				res.render('users/preview.hbs', { result, alert: 'No se pueden ingresar una cantidad menor a 1' });
			}
		}
	} else {
		res.render('users/preview.hbs', { result, alert: 'Agotado' });
	}
});

router.get('/preview/:id', async (req, res, next) => {
	const result = await Products.findById(req.params.id);
	if (req.isAuthenticated()) {
		if (result.amount == 0) {
			res.render('users/preview.hbs', { result, alert: 'Agotado' })
		} else {
			res.render('users/preview.hbs', { result })
		}
	} else {
		res.render('users/login.hbs', { result, alert: 'Necesitas iniciar sesion para comprar' })
	}
})

function Auth (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.render('users/login.hbs')
}

module.exports = router;
