const { Router } = require('express');
const router = Router();
const { v4: uuidv4 } = require('uuid');

const Comments = require('../models/comments.js')

router.get('/comments', Auth, async (req, res) => {
	const result = await Comments.find()
	res.render('users/comments.hbs', { result: result.reverse(), title: 'to Comments' })
});

router.post('/public/comment', async (req, res) => {
	const newComment = new Comments({
		code: uuidv4(),
		name: req.user.email,
		description: req.body.description,
		timeAgo: Date.now()
	});
	await newComment.save();
	res.redirect('/comments');
});

function Auth(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.render('users/login.hbs', { alert: 'Necesitas iniciar sesion para comentar' })
}

module.exports = router;