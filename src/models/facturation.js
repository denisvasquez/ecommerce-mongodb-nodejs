// Importa de la libreria MONGOOSE sus modulos Schema y model
const { Schema, model } = require('mongoose');

// Esquema para la coleccion facturacion donde se guardan las facturas tanto las compras que haga el administrador como las compras que generen los usuarios
const facturationSchema = new Schema({
	code: { type: String },
	name: { type: String },
	date: { type: String },
	typeof: { type: String },
	mount: { type: Number },
	clientOrV: { type: String }
});

// Exporta el modelo del esquema para la facturacion
module.exports = model('Facturation', facturationSchema);