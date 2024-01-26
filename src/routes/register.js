const { Router } = require('express');
const router = Router();
const Facture = require('../models/facturation.js');
const { v4: uuidv4 } = require('uuid');
const buysUsers = require('../models/buysUsers.js');
const Products = require('../models/products.js');
const register = require('../models/register.js');

router.get('/register', async (req, res) => {
	if (req.isAuthenticated()) {
		const result = await register.find({ nameUser: req.user.email});
		res.render('users/registerPreview.hbs', { result: result.reverse() });
	} else {
		res.render('users/login.hbs', { alert: 'Necesitas iniciar sesion para ver el registro' });
	}
});

router.post('/register/:id', async (req, res) => {
	const result = await Products.findById(req.params.id);
	if (result.amount > 0) {
		if (req.body.amount >= 1) {
			if (Number(req.body.amount) <= Number(result.amount)) {
					const newRegister = new register({
						code: uuidv4(),
						nameUser: req.body.nameUser,
						product: req.body.nameProduct,
						priceProduct: req.body.priceProduct,
						amountProducts: req.body.amount,
						timeAgo: Date.now(),
						mountTotal: Number(req.body.priceProduct) * Number(req.body.amount),
					});
					await newRegister.save();
					res.redirect('/register');
			} else {
				if (Number(req.body.amount) > Number(result.amount)) {
					res.render('users/preview.hbs', { result, alert: `Unicamente contamos con ${result.amount} unidades` });
				}
			}
		} else {
			if (req.body.amount < 1) {
				res.render('users/preview.hbs', { result, alert: 'No se pueden ingresar una cantidad menor a 1' });
			}
		}
	} else {
		res.render('users/preview.hbs', { result, alert: 'Agotado' });
	}
	console.log(req.body)
});

router.get('/register/buy', async (req, res) => {
	if (req.isAuthenticated()) {
		const result = await register.find({ nameUser: req.user.email});
		if (result.length > 0) {
			const asdf = await Products.findById(req.params.id);

			const mount = result.map(item => Number([ item.mountTotal ]))
				.reduce((acum, price) => acum + price);

			// option 2
			// let mount = 0;
			// for (let i = 0; i <= result.length - 1; i++) {
			// 	let sum = Number(result[i].mountTotal);
			// 	mount += sum;
			// };

			const newFacture = new Facture({
				code: uuidv4(),
				name: req.user.email,
				date: Date.now(),
				typeof: 'Venta al cliente',
				mount: mount,
				clientOrV: req.user.email

			});
			res.render('users/viewFacture.hbs', { newFacture, result: result.reverse() });
		} else {
			res.redirect('/profile')
		}
	} else {
		res.render('users/login.hbs', { alert: 'Necesitas iniciar sesion para generar la factura' });
	};
});

router.get('/generate', async (req, res) => {

	if (req.isAuthenticated()) {
		const result = await register.find({ nameUser: req.user.email});

		result.forEach( async register => {
			const newBuyUser = new buysUsers({
				code: register.code,
				nameUser: register.nameUser,
				nameProduct: register.product,
				priceProduct: register.priceProduct,
				timeAgo: Date.now(),
				amount: register.amountProducts,
				pay: register.mountTotal
			});
			await newBuyUser.save();
			const product = await Products.find({ name: register.product})
			const updateValue = {
				amount: Number(product[0].amount) - Number(register.amountProducts)
			};
			Object.assign(product[0], updateValue);
			await product[0].save()
		});

		try {
			const mount = result.map(item => Number([ item.mountTotal ]))
				.reduce((acum, price) => acum + price);
			const newFacture = new Facture({
				code: uuidv4(),
				name: req.user.email,
				date: Date.now(),
				typeof: 'Venta al cliente',
				mount: mount,
				clientOrV: req.user.email
			});
			await newFacture.save();
			await register.deleteMany({ nameUser: req.user.email});
			const response = await buysUsers.find({ nameUser: req.user.email});
			res.render('users/profile.hbs', { result: response.reverse(), alert: 'Proceso realizado con exito' });
		} catch(err) {
			res.redirect('/profile')
		}
	} else {
		res.render('users/login.hbs', { alert: 'Necesitas iniciar sesion para generar la factura'})
	}
});

router.get('/register/delete/:id', async (req, res) => {
	const result = await register.findByIdAndDelete(req.params.id);
	res.redirect('/register')
});

module.exports = router;
