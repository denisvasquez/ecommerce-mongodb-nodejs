// dependencias
const { Router } =  require('express');
const router = Router();
const { v4: uuidv4 } = require('uuid');
// importa los modelos de las colecciones
const Product = require('../models/products.js');
const Facture = require('../models/facturation.js')

// ruta que envia un Json con el resulta de productos cuando se hace la peticion a la ruta
router.get('/', async (req, res) => {
	const result = await Product.find();
	res.json(result);
});

// ruta que agrega un nuevo producto cuando se hace una peticion POST 
router.post('/', async (req, res) => {
	// crea un nuevo Producto dentro de un objeto
	const newProduct = new Product({
		code: uuidv4(),
		name_Person: req.body.name_Person,
		name: req.body.name,
		price: req.body.price,
		unit: req.body.unit,
		dateInside: Date.now(),
		category: req.body.category,
		amount: req.body.amount,
		mount: Number(req.body.price) * Number(req.body.amount)
	});
	await newProduct.save(); // guarda el nuevo producto creado
	
	// crea una nueva factura de compra de producto
	const newFacture = new Facture({
		code: newProduct.code,
		name: req.body.name,
		date: Date.now(),
		typeof: 'Compra de mercaderia',
		mount: Number(req.body.price) * Number(req.body.amount),
		clientOrV: req.body.name_Person
	});
	await newFacture.save(); // guarda la factura creada
	res.redirect('/api/admin/view') // redirecciona a la ruta de administrator 
});

module.exports = router;
