var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  upvotes: {type: Number, default: 0},
  rumor: { type: mongoose.Schema.Types.ObjectId, ref: 'Rumor' }
});

mongoose.model('Comment', CommentSchema);
