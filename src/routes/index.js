// metodo Router que viene desde express
const { Router } = require('express');
// inicializa el metodo Router en una constante router
const router = Router();
// dependencia para el uso de passport
const passport = require('passport');
// requiere los modelos de las colecciones
const Product = require('../models/products.js');
const BuyUser = require('../models/buysUsers.js');

// ruta para la pantalla de inicio
router.get('/', async (req, res) => {
	res.render('users/index.hbs', { title: 'User'});
});

// ruta para rederizar la vista para registrar un nuevo usuario
router.get('/singin', (req, res, next) => {
	res.render('users/sing.hbs', { title: 'Sing Up' })
});

// ruta con el metodo POST para enviar datos a passport y registrar
//           un nuevo usuario
router.post('/singup', passport.authenticate('local-singup', {
	successRedirect: '/profile',
	failureRedirect: '/singin',
	passReqToCallback: true
}));

// ruta para renderizar la vista para inciar sesion
router.get('/login', (req, res, next) => {
	res.render('users/login.hbs', { title: 'Login' })
});

// ruta con el metodo POST para enviar datos a passport e inicar sesion
router.post('/login', passport.authenticate('local-singin', {
	successRedirect: '/profile',
	failureRedirect: '/login',
	passReqToCallback: true
}));

// ruta para renderizar la vista para editar el perfil
router.get('/edith/myprofile', Auth, (req, res) => {
	res.render('users/edith.hbs');
});

// ruta con el metodo POST para enviar datos a passport y editar perfil
router.post('/edith/myprofile', passport.authenticate('local-edith', {
	successRedirect: '/profile',
	failureRedirect: '/edith/myprofile',
	passReqToCallback: true
}))

// ruta para cerrar sesion y redireccionar a la ruta inicial
router.get('/logout', (req, res, next) => {
	req.logout();
	res.redirect('/');
})

// ruta protegida para entrar el perfil
// busca por el nombre de usuaio autenticado todas las
//      compras que a hecho
// antes de entrar a la funcion, inicia la funcion Auth
router.get('/profile', Auth, async (req, res, next) => {
	const result = await BuyUser.find({ nameUser: req.user.email});
	res.render('users/profile.hbs', { username: req.user.email, result: result.reverse() });
})

// funcion que verifica si hay usuario autenticado
// si no hay usuario autenticado redirecciona a la ruta para iniciar sesion
function Auth(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login')
}

// exportar el modulo para el uso de las rutas
module.exports = router;
