// Importa de la libreria MONGOOSE sus modulos Schema y model
const { Schema, model } = require('mongoose');

// Esquema de la coleccion registro
const registerSchema = new Schema({
	code: { type: String},
	nameUser: {  type: String},
	product: { type: String },
	priceProduct: { type: Number },
	timeAgo: { type: String},
	amountProducts: { type: Number },
	mountTotal: { type: Number }
});

// Exporta el modelo del esquema registro
module.exports = model('register', registerSchema);
