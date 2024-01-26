// requiere del modulo timeago.js su metodo format
const { format } = require('timeago.js');

// se crea un objeto en blanco
const helpers = {};

helpers.timeago = (timestamp) => {
	return format(timestamp);
};

// exporta el objeto helpers con sus metodos con una funcion flecha
module.exports = helpers;
