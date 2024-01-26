// importa de la libreria MONGOOSE sus modulos Schema y model
const { Schema, model } = require('mongoose');

// Esquema para la coleccion Compras de usuarios
const buyUsersSchema = new Schema({
	code: { type: String },
	nameUser: { type: String },
	nameProduct: { type: String },
	priceProduct: { type: Number },
	timeAgo: { type: String },
	amount: { type: Number },
	pay: { type: Number }
});

// Exporta el modelo del esquema de Compras de usuarios
module.exports = model('BuyUsers', buyUsersSchema);
