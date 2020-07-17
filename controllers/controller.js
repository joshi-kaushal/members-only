const express = require('express')
const async = require('async')
const moment = require('moment')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');

const User = require('../models/user')
const Post = require('../models/post')

exports.get_home = function(req, res) {
	 Post.find()
        .populate('user')
        .then((posts) => {
            res.render('index', { title: 'Home', posts });
        })
}

exports.login_get = function(req, res) {				// DONE
	res.render('login', { title: 'Log-in' } )
}

// TODO: DELETE
// exports.login_post = function(req, res) {				
// 	res.render('login', { title: 'Log-in' })
// }


exports.signup_get = function(req, res) {				// DONE
	res.render('signup', { title: 'Sign-up' })
}

exports.signup_post = async function(req, res, next) {		// DONE
	const { firstName, lastName, username, password } = req.body
	const errors = validationResult(req)

	if(!errors.isEmpty()) {
		res.render('signup', { errors: errors.errors })
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
          //req.flash("error_msg", `Username already registered, please login`);
          return res.redirect("/login");
        } else return next(err);
      }
      //req.flash("success_msg", "Registration Successful. Please login.");
      res.redirect("/login");
    });	

}


exports.newpost_get = function(req, res) {				// DONE
	res.render('newPost', { title: 'New Post' })
}


exports.newpost_post = function(req, res, next) {		// DONE
	const { title, content } = req.body

	const errors = validationResult(req)
	if(!errors.isEmpty()) {
		res.render('newPost', { title: "ERROR NEW POST", errors: errors.array() })
	}

	const newPost = new Post({
		author: req.params.id,
		title: title,
		content: content,
		timestamp: moment().format('MMMM Do YYYY [at] HH:mm:ss'),
	})

	console.log(`\n THE POST WAS: \n ${newPost}`)
	newPost.save(err => {
		if(err) { return next(err) }
		res.redirect('/')
	})
}


exports.members_get = function(req, res) {				// DONE
	res.render('become_member', { title: 'Become a member'})
}

exports.members_post = function(req, res) {				// DONE
	const errors = validationResult(req)

	if(!errors.isEmpty()){
		res.render('become_member', { title: 'Become a member', errors: errors.errors })
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



