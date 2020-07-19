const express = require('express')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const async = require('async')
const { validationResult } = require('express-validator');

const User = require('../models/user')
const Post = require('../models/post')

exports.get_home = function(req, res) {
	Post.find()
        .populate('user')
        .then((post) => {
            res.render('index', { title: 'Chad', post });
    })
}

exports.login_get = function(req, res) {				
	res.render('login', { title: 'Log-in' } )
}

// No need for login_post since the necessary work is done in index.js

exports.signup_get = function(req, res) {				
	res.render('signup', { title: 'Sign-up' })
}

exports.signup_post = async function(req, res, next) {		
	const { firstName, lastName, username, password } = req.body
	const errors = validationResult(req)

	if(!errors.isEmpty()) {
		res.render('signup', { errors: errors.errors })
		return
	}
	
	hashedPassword = await bcrypt.hash(password, 2);
    const newUser = new User({
      firstName,
      lastName,
      username,
      password: hashedPassword,
      member: false,
      admin: false
    });

    console.log(newUser)
    newUser.save(err => {
      if (err) {
        if (err.code === 11000) {
          return res.redirect("/login");
        } else return next(err);
      }
      res.redirect("/login");
    });	

}


exports.newpost_get = function(req, res) {				
	res.render('newPost', { title: 'New Post' })
}


exports.newpost_post = function(req, res, next) {		
	const { title, content } = req.body
	console.log(req.body)

	const errors = validationResult(req)
	if(!errors.isEmpty()) {
		res.render('newPost', { title: "New Post", errors: errors.array() })
		return
	}

	let currentTime = Date()
	const newPost = new Post({
		user: req.user.id,
		title: title,
		content: content,
		timestamp: currentTime
	})

	console.log(`\n THE POST WAS: \n ${newPost}`)
	newPost.save(err => {
		if(err) { return next(err) }
		res.render('index', { title: "MeMb3r$", post: newPost })
	})
}


exports.members_get = function(req, res) {				
	res.render('become_member', { title: 'Become a member'})
}

exports.members_post = function(req, res) {				
	if(req.body.password === 'bruhmintosh') {

		const errors = validationResult(req)
		if(!errors.isEmpty()){
			res.render('become_member', { title: 'Become a member', errors: errors.errors })
			return
		}
		console.log(req.body.user)
		const becomeMember = new User({
        	_id: req.user.id,
			member: true,
		})

		User.findByIdAndUpdate(req.user.id, becomeMember).then((updated) => {
			res.redirect('/')
		})
	} else {
		res.render('become_member', { title: 'become a member', errors: ['wrong password!', 'tried bruhmintosh?'] })
	}
}


exports.admins_get = function(req, res) {				
	res.render('become_admin', { title: 'Become an admin' })
}


exports.admins_post = function(req, res) {				
	
	const UwU = ['sarvesh', 'pratik', 'devesh', 'rahul']
	
	if(UwU.includes(req.body.password)) {
		const errors = validationResult(req)
		if(!errors.isEmpty()) {
			res.render('become_admin', { title: 'Become an admin', errors: errors.array() })
			return
		}

		const becomeAdmin = new User ({
        	_id: req.user.id,
			admin: true
		})

		User.findByIdAndUpdate(req.user.id, becomeAdmin).then(updated => {
			res.redirect('/')
		})
	} else {
		res.render('become_admin', { title: 'become an admin', errors: ['it\'s one of the friends i admire most', 'just NAME', 'totally in lowercase', 'UwU'] })
	}
}


exports.delete_get = function(req, res) {				

	const errors = validationResult(req)
	if(!errors.isEmpty()) {
		res.render('/', { title: 'ERROR! Become an admin', errors: errors.array() })
		return
	}

	Post.findByIdAndDelete(req.params.id).then(deleted => {
		res.redirect('/')
	})
}


exports.logout = function(req, res) {					
	req.logout('/')
	res.redirect('/login')
}



