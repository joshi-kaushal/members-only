const mongoose = require('mongoose')
const Schema = mongoose.Schema

let PostSchema = new Schema ({
	author: { type: Schema.Types.ObjectId, ref: 'fullName' },
	title: { type: String, required: true, minlength: 6, maxlength: 20 },
	content: { type: String, required: true, minlength: 6 },
	timestamp: { type: Date, required: true }
})

// Virtual

// Export
module.exports = mongoose.model('Post', PostSchema)