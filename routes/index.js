var express = require('express');
var router = express.Router();

const passport = require('passport')
const { check } = require('express-validator');

const User = require('../models/user')
const Post = require('../models/post')
const controller = require('../controllers/controller')


	/* GET HOME */
router.get('/', controller.get_home)

	/* LOGIN */	
router.get('/login', controller.login_get)

router.post(
  '/login',
  passport.authenticate('local', { 
  	successRedirect: '/new-post',
    failureRedirect: '/signup'
  })
);

	/* SIGNUP */
router.get('/signup', controller.signup_get)

router.post('/signup', [
	check('firstName', 'First name must be at least 2 characters long.')
		.isLength({ min: 2, max: 20 }).escape(),
	check('lastName', 'Last name must be at least 2 characters long.')
		.isLength({ min: 2, max: 20 }).escape(),
	check('username', 'Username must be at least 4 characters long')
		.isLength({ min: 4, max: 20 }).escape(),
	check('password', 'Passowrd must be at least 8 characters long')
		.isLength({ min: 8, max: 20 }).escape(),
	check('confirmPassword', 'Passowrd must match.')
		.custom( (val, {req} ) => val === req.body.password)
	],
	controller.signup_post
)


	/* NEW MESSAGE */
router.get('/new-post', controller.newpost_get)

router.post('/new-post', [
        check('title', 'Title must be at least 3 characters long')
            .isLength({ min: 3, max: 30 })
            .escape(),
        check('content', 'You must send a comment').not().isEmpty().escape(),
    ],
	controller.newpost_post
)


	/* MEMBER */
router.get(
	'/members',	controller.members_get)

router.post(
	'/members',
	[
		check('password', "Did you try 'bruhmintosh' ?")
			.exists()
			.trim()
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
router.get('/:id/delete', controller.delete_get)


	/* LOGOUT */
router.get('/logout', controller.logout)

module.exports = router;