// Importa de la libreria MONGOOSE sus modulos Schema y model
const { Schema, model } = require('mongoose');

// Esquema de la coleccion productos
const productSchema = new Schema({
	code: { type: String },
	name_Person: { type: String },
	name: { type: String },
	price: { type: Number },
	unit: { type: String },
	dateInside: { type: Date },
	category: { type: String },
	amount: { type: Number },
	mount: { type: Number }
});

// Exporta el modelo de la coleccion para los productos
module.exports = model('Product', productSchema);
