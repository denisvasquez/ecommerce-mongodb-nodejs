// Importa de la libreria MONGOOSE sus modulos Schema y model
const { Schema, model } = require('mongoose');

// Esquema para la coleccion comentarios
const commentsSchema = new Schema({
	code: { type: String },
	name: { type: String },
	description: { type: String },
	timeAgo: { type: String }
});

// Exporta el modelo de esquema para los comentarios
module.exports = model('Comments', commentsSchema);
