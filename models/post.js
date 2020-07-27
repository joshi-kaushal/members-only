const mongoose = require('mongoose')
const Schema = mongoose.Schema
const dateFormat = require("dateformat");

let PostSchema = new Schema ({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	title: { type: String, required: true, minlength: 6, maxlength: 40 },
	content: { type: String, required: true, minlength: 6 },
	timestamp: { type: Date, required: true }
})

// Virtual
PostSchema.virtual("dateCreated").get(function() {
  return dateFormat(this.timestamp, "mmmm dS, yyyy, h:MM:ss TT");
});

// Export
module.exports = mongoose.model('Post', PostSchema)