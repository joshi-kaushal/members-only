const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema
let UserSchema = new Schema({
	firstName: { type: String, required: true, minlength: 2, maxlength: 20},
	lastName: { type: String, required: true, minlength: 2, maxlength: 20},
	username: { type: String, required: true, minlength: 4, maxlength: 20},
	password: { type: String, required: true, minlength: 8},
	member: { type: Boolean, required: true },
	admin: { type: Boolean, required: true },
	messeges: [{ type: Schema.Types.ObjectId, ref:'Post'}]
})

// Virtual
UserSchema
  .virtual('fullName')
  .get(function() {
  	return `${this.firstName} ${this.lastName}`
  })

UserSchema
  .virtual('url')
  .get(function() {
  	return `users/${this._id}`
  })

// Export module
module.exports = mongoose.model('User', UserSchema)