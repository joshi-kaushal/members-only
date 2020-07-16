const express = require('express')
const async = require('async')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');

const User = require('../models/user')
const Post = require('../models/post')


exports.login_get = function(req, res) {				// DONE
	res.render('login', { title: 'Log-in' } )
}

// TODO: DELETE
exports.login_post = function(req, res) {				
	res.render('login', { title: 'Log-in' })
}


exports.signup_get = function(req, res) {				// DONE
	res.render('signup', { title: 'Sign-up' })
}

exports.signup_post = function(req, res, next) {		// DONE
	const { firstName, lastName, username, passowrd } = req.body
	const errors = validationResult(req)

	if(!errors.isEmpty()) {
		res.render('signup', { errors: errors.array() })
	}
	
	bcrypt.hash(passowrd, 10, (err, hashedPassword) => {
		if(err) { return next(err) }
		
		const newUser = new User({
			firstName: firstName,
			lastName: lastName,
			username: username,
			passowrd: passowrd,
			member: false,
			admin: false
		}).save(err => {
			if(err) { return next(err) }
			redirect('/login')
		})

	})
	console.log(req.body)
}


exports.newpost_get = function(req, res) {				// DONE
	res.render('newPost', { title: 'New Post', temp: 'TEST'})
}


exports.newpost_post = function(req, res) {
	res.render('', { title: '', temp: ''})
}


exports.members_get = function(req, res) {				// DONE
	res.render('become_member', { title: 'Become a member'})
}

exports.members_post = function(req, res) {				// DONE
	const errors = validationResult(req)

	if(!errors.isEmpty()){
		res.render('become_member', { title: 'Become a member',errors: errors.array() })
	}

	const becomeMember = new User({
		member: true
	})

	User.findByIdAndUpdate(req.user.id, becomeMember).then(updated => {
		res.redirect('/')
	})

}


exports.admins_get = function(req, res) {				// DONE
	res.render('become_admin', { title: 'Become an admin' })
}


exports.admins_post = function(req, res) {				// DONE
	
	const errors = validationResult(req)
	if(!errors.isEmpty()) {
		res.render('/become_admin', { title: 'Become an admin', errors: errors.array() })
	}

	const becomeAdmin = new User ({
		admin: true
	})

	User.findByIdAndUpdate(req.user.id, becomeAdmin).then(updated => {
		res.redirect('/')
	})
}


exports.delete_get = function(req, res) {				// DONE

	const errors = validationResult(req)
	if(!errors.isEmpty()) {
		res.render('/', { title: 'ERROR! Become an admin', errors: errors.array() })
	}

	Post.findByIdAndDelete(req.params.id).then(deleted => {
		res.redirect('/')
	})
}


exports.logout = function(req, res) {					// DONE
	req.logout('/')
	res.redirect('/login')
}



