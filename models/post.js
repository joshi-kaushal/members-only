const mongoose = require('mongoose')
const Schema = mongoose.Schema

let PostSchema = new Schema ({
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	title: { type: String, required: true, minlength: 6, maxlength: 20 },
	content: { type: String, required: true, minlength: 6 },
	timestamp: { type: Date, required: true }
})

// Export
module.exports = mongoose.model('Post', PostSchema)