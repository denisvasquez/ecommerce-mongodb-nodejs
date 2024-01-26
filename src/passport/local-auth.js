// dependencias -> passport y passport-local
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// requiere los modelos para actualizar los nombres de todo cuando se actualiza el nombre de usuario
const Client = require('../models/clients.js');
const buysUsers = require('../models/buysUsers.js');
const register = require('../models/register.js');
const facture = require('../models/facturation.js')
const Comments = require('../models/comments.js');

// guarda en un arhivo del navegador 
passport.serializeUser((client, done) => {
	done(null, client.id);
});

// busca por id del usuario guardado cuando se cambia de pagina
passport.deserializeUser(async (id, done) => {
	const client = await Client.findById(id);
	done(null, client)
});

passport.use('local-edith', new localStrategy({
	usernameField: 'userName',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, email, password, done) => {
	const resultVerify = await Client.findOne({ email: req.body.newEmail });

	if (resultVerify) {
		return done(null, false, req.flash('edithError', 'Este nombre de usuario ya existe'));
	} else {

		const buys = await buysUsers.find({ nameUser: req.body.userName });
		const registers = await register.find({ nameUser: req.body.userName });
		const factures = await facture.find({ clientOrV: req.body.userName });
		const comments = await Comments.find({ name: req.body.userName });

		if (buys) {
			buys.forEach( async buy => {
				const newUserName = { nameUser: req.body.newEmail }
				Object.assign(buy, newUserName);
				await buy.save();
			})
		}

		if (registers) {
			registers.forEach(async register => {
				const newUserName = { nameUser: req.body.newEmail }
				Object.assign(register, newUserName);
				await register.save();
			})
		}

		if (factures) {
			factures.forEach( async facture => {
				const newUserName = { name: req.body.newEmail, clientOrV: req.body.newEmail };
				Object.assign(facture, newUserName);
				await facture.save()
			})
		}

		if (comments) {
			comments.forEach( async comment => {
				const newName = { name: req.body.newEmail }
				Object.assign(comment, newName);
				await comment.save();
			})
		}

		const client = new Client();
		client.email = req.body.newEmail;
		client.password = client.encryptPassword(req.body.password);
		await client.save();
		await Client.deleteOne({ email: req.body.userName });
		done(null, client);

	}

}));


passport.use('local-singup', new localStrategy({
	usernameField: 'userName',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, email, password, done) => {

	const result = await Client.findOne({ email: email})

	if (result) {
		return done(null, false, req.flash('SingUpMessage', 'Este usuario ya existe'));
	} else {
		const client = new Client()
		client.email = email;
		client.password = client.encryptPassword(password);
		await client.save();
		done(null, client);
	}
}));

passport.use('local-singin', new localStrategy({
	usernameField: 'userName',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, email, password, done) => {
	const result = await Client.findOne({ email: email});
	if (!result) {
		return done(null, false, req.flash('singInMessage', `No existe el usuario ${email}`));
	}
	if (!result.comparePassword(password)) {
		return done(null, false, req.flash('singInMessage', 'Contraceña Incorrecta'));
	}
	done(null, result);
}));
