// dependences
const { Router } = require('express');
const router = Router();

// import the model of the tables
const Product = require('../models/products.js');
const Facture = require('../models/facturation.js');
const Comments = require('../models/comments.js')

// render the form for add a product
router.get('/administration', (req, res) => {
	res.render('admin/admin.hbs', { title: 'Admin' });
});


// render the view for each object
router.get('/admin/view', async (req, res) => {
	const result = await Product.find();
	res.render('admin/adminView.hbs', { result, title: 'Admin' });
});

// search for code and delete
router.get('/product/:code', async (req, res) => {
	await Product.deleteOne({ code: req.params.code });
	await Facture.deleteOne({ code: req.params.code })
	res.redirect('/api/admin/view');
});


// render for code a form for the edition
router.get('/product/edith/:code', async (req, res) =>{

	// return an list with the object of result
	const result = await Product.find({ code: req.params.code })

	// render the HTML with the result for the edition
	res.render('admin/updateItem.hbs', { result: result[0], title: 'Admin' });

});

// update the values of the object selected in the view
router.post('/product/edith/:code', async (req, res) => {
	// return an list with the object of result
	const product = await Product.find({ code: req.params.code });
  

  
	const updateProduct = {
		code: product[0].code,
		name_Person: req.body.name_Person,
		name: req.body.name,
		price: req.body.price,
		unit: req.body.unit,
		dateInside: product[0].dateInside,
		category: req.body.category,
		amount: req.body.amount,
		mount: Number(req.body.price) * Number(req.body.amount)
	}
	
	// save the news values
	Object.assign(product[0], updateProduct);
	await product[0].save();

	// return an list with the object of result
	const facture = await Facture.find({ code: product[0].code });

	console.log(facture)

	const updateFacture = {
		code: facture[0].code,
		name: req.body.name,
		date: facture[0].date,
		typeof: 'Compra',
		mount: Number(req.body.price) * Number(req.body.amount),
		clientOrV: req.body.name_Person
	};

	// save the news values
	Object.assign(facture[0], updateFacture);
	await facture[0].save();

	// redirect to the HTML or route View administrator
	res.redirect('/api/admin/view');
});


// route to the view of comments
router.get('/comments', async (req, res) => {
	const result = await Comments.find()
	res.render('admin/viewComments.hbs', { result: result.reverse(), title: 'to Comments' })
});

// route for delete comment
router.get('/comments/:id', async (req, res) => {
	await Comments.findByIdAndDelete(req.params.id)
	res.redirect('/api/comments')
});

module.exports = router;