var express = require('express');
var router = express.Router();

const { check } = require('express-validator');
const passport = require('passport')

const User = require('../models/user')
const Post = require('../models/post')
const controller = require('../controllers/controller')


	/* GET HOME */
router.get('/', function(req, res) {
  res.render('index', { title: 'members-only' });
});

	/* LOGIN */
router.get('/login', controller.login_get)

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureaRedirect: '/login',
		failureFlash: true
	})
)


	/* SIGNUP */
router.get('/signup', controller.signup_get)

router.post('/signup', [
	check('first-name', 'First name must be at least 2 characters long.')
		.isLength({ min: 2, max: 20 }).escape(),
	check('last-name', 'Last name must be at least 2 characters long.')
		.isLength({ min: 2, max: 20 }).escape(),
	check('username', 'Username must be at least 4 characters long')
		.isLength({ min: 4, max: 20 }).escape(),
	check('password', 'Passowrd must be at least 6 characters long')
		.isLength({ min: 4, max: 20 }).escape(),
	check('confirm-password', 'Passowrd must match.')
		.custom( (val, {req} ) => val === req.body.password)
	],
	controller.signup_post
)


	/* NEW MESSAGE */
router.get('/new-post', controller.newpost_get)

router.post(
	'/new-post',
	[
		check('title', "Title must be atleast 6 characters long.")
			.isLength({ min: 6, max: 20 })
			.escape().not().isEmpty(),
		check('post', "Post must be atleast 6 characters long.")
			.isLength({ min: 6})
			.escape().not().isEmpty()
	],
	controller.newpost_post)


	/* MEMBER */
router.get(
	'/members',	controller.members_get)

router.post(
	'/members',
	[
		check('password', "Did you try 'niggargatta' ?")
			.custom( (val, {req} ) => val === req.body.password)
			.escape()
	],
 	controller.members_post
)


	/* ADMINS */
router.get('/admins', controller.admins_get)

router.post(
	'/admins',
	[
		check('password', "one of the four friends i admire, lowercase only.")
			.custom( (val, {req} ) => val === req.body.password).escape()
	],
	controller.admins_post)


	/* DELETE MESSAGE */
router.get('/:id/delte', controller.delete_get)


	/* LOGOUT */
router.get('/logout', controller.logout)

module.exports = router;

/*
home
login
signup
new message
make member
make admin
logout */