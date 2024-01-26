if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
};

console.log(process.env.NODE_ENV);

// dependences
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const expressHbs = require('express-handlebars');
const handlebars = require('handlebars');
const passport = require('passport');
const expressSession = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');

// initializations
const app = express();
require('./database.js');
require('./passport/local-auth.js');

// settings
app.set('port', process.env.PORT || 8000);
// view engine
app.set('views', path.join(__dirname, './views'));
app.engine('.hbs', expressHbs({
	defaultLayout: 'main.hbs',
	layoutsDir: path.join(app.get('views'), 'layouts'),
	partialsDir: path.join(app.get('views'), 'partials'),
	extname: '.hbs',
	helpers: require('./libs/time.js'),
	handlebars: handlebars
}));
app.set('view engine', '.hbs');

// middlewares
// app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(expressSession({
	secret: 'mysecretsession',
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// message of error and the user authenticated
app.use((req, res, next) => {
	app.locals.singUpMessage = req.flash('SingUpMessage');
	app.locals.singInMessage = req.flash('singInMessage');
	app.locals.edithError = req.flash('edithError')
	app.locals.user = req.user;
	next();
});

// routes
app.use('/api', require('./routes/admin.js'));
app.use(require('./routes/index.js'));
app.use(require('./routes/comments.js'));
app.use(require('./routes/buys.js'));
app.use(require('./routes/register.js'));
app.use('/api/products', require('./routes/products.js'));
app.use('/api/facturation', require('./routes/facturation.js'));

// static files
app.use(express.static(path.join(__dirname, './public')));

// start server
app.listen(app.get('port'), () => {
	console.log('Server on port', app.get('port'))
});
