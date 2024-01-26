// Importa de la libreria MONGOOSE sus modulos Schema y model
const { Schema, model } = require('mongoose');
// Importa la libreria que servira para encriptar las contraceñas
const bcrypt = require('bcrypt-nodejs');

// Esquema para la coleccion clientes
const clientSchema = new Schema({
	email: { type: String },
	password: { type: String },
});

// Ya que el cliente necesita crear una cuenta se crean dos metodos
// Encripta la contraceña de los clientes
clientSchema.methods.encryptPassword = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
// Cuando inicia Sesion se necesita comparar la contraceña encriptada con la que esta ingresando el usuario en el formulario.
clientSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

// Exporta el modelo del esquema para los clientes con sus metodos
module.exports = model('Clients', clientSchema);
