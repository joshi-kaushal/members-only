require('dotenv').config()
const express = require('express')
const async = require('async')
const bcrypt = require('bcryptjs')
const moment = require('moment')
var session = require('express-session')
const { validationResult } = require('express-validator');

const User = require('../models/user')
const Post = require('../models/post')


	/* DISPLAY HOME PAGE */
exports.get_home = function(req, res) {
	Post.find()
      .populate('user')
      .then((post) => {
      	res.render('index', { title: 'Member\'s Only', post: post.reverse() });
      })
}


	/* GET & POST REQUESTS FOR LOGIN */
exports.login_get = function(req, res) {				
	res.render('login', { title: 'Log-in' } )
}

// No need for login_post since the necessary work is done in index.js


	/* GET & POST REQUESTS FOR SIGNUP*/
exports.signup_get = function(req, res) {				
	res.render('signup', { title: 'Sign-up' })
}

exports.signup_post = async function(req, res, next) {		
	const { firstName, lastName, username, password } = req.body
	const errors = validationResult(req)

	if(!errors.isEmpty()) {
		res.render('signup', { title: "Sign-up", errors: errors.errors })
		return
	}
	
	hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      member: false,
      admin: false
    });

    newUser.save(err => {
      if (err) {
        if (err.code === 11000) {
          return res.render("/signup", { title: 'Log-in', errors: ['Username Already Exists.'] });
        } else return next(err);
      }
      res.redirect("/login");
    });	

}


	/* GET & POST REQUESTS FOR NEW POST */
exports.newpost_get = function(req, res) {				
	res.render('new_post', { title: 'New Post' })
}


exports.newpost_post = function(req, res, next) {		
	const { title, content } = req.body	
	const errors = validationResult(req)

	if(!errors.isEmpty()) {
		res.render('new_post', { title: "New Post", errors: errors.errors })
		return
	}

	let currentTime = Date()
	const newPost = new Post({
		user: req.user.id,
		title: title,
		content: content,
		timestamp: currentTime
	})

	newPost.save(err => {
		if(err) { return next(err) }
		res.redirect('/')
	})
}


	/* GET & POST REQUESTS FOR MEMBER PANEL*/
exports.members_get = function(req, res) {				
	res.render('become_member', { title: 'Become a member' })
}

exports.members_post = function(req, res) {				
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		res.render('become_member', { title: 'Become a member', errors: errors.errors })
		return
	}

	const becomeMember = new User({
        _id: req.user.id,
		member: true,
	})

	User.findByIdAndUpdate(req.user.id, becomeMember).then((updated) => {
		res.redirect('/')
	})
}


	/* GET & POST REQUESTS FOR ADMIN PANEL */
exports.admins_get = function(req, res) {				
	res.render('become_admin', { title: 'Become an admin' })
}

exports.admins_post = function(req, res) {
	const errors = validationResult(req)
	if(!errors.isEmpty()) {
		res.render('become_admin', { title: 'Become an admin', errors: errors.errors, hint: ['one of the four friends I admire most', 'all lowercase'] })
		return
	}

	const becomeAdmin = new User ({
       	_id: req.user.id,
		admin: true
	})

	User.findByIdAndUpdate(req.user.id, becomeAdmin).then(updated => {
		res.redirect('/')
	})
	
}


	// User Profile
exports.user_profile = function(req, res) {
	if(!req.user) {
		res.render('user_profile', { title: 'User Profile' });
		return
	} else {
	  Post.find({ user: req.user.id })
      .populate('post')
      .then((post) => {
      	res.render('user_profile', { title: 'User Profile', post: post.reverse() });
      })	
	}
	
}

	/* GET REQUEST FOR DELETING MESSAGE */
exports.delete_get = function(req, res) {				

	const errors = validationResult(req)
	if(!errors.isEmpty()) {
		res.render('/', { title: 'Member\'s Only', errors: errors.array() })
		return
	}

	Post.findByIdAndDelete(req.params.id).then(deleted => {
		res.redirect('/')
	})
}


	/* REQUEST FOR LOG OUT */
exports.logout = function(req, res) {					
	req.logout('/')
	req.session.destroy();
	req.session = null 
	res.redirect('/login')
}