var express = require('express');
var router = express.Router();
//DB
var mongoose = require('mongoose');
//model
var Comment = mongoose.model('Comment')
var Rumor = mongoose.model('Rumor')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET rumors. */
router.get('/rumors', function(req, res, next) {
  Rumor.find(function(err, rumors) {
    if(err) { return next(err); }

    res.json(rumors);
  })
});

/* POST rumor. */
router.post('/rumors', function(req, res, next) {
  var rumor = new Rumor(req.body);

  rumor.save(function(err, rumor){
    if(err){ return next(err); }

    res.json(rumor);
  });
});

/* rumor PARAM */
router.param('rumor', function(req, res, next, id) {
  var query = Rumor.findById(id);

  query.exec(function (err, rumor){
    if (err) { return next(err); }
    if (!rumor) { return next(new Error('can\'t find rumor')); }

    req.rumor = rumor;
    return next();
  });
});

/* GET rumor */
router.get('/rumors/:rumor', function(req, res) {
  req.rumor.populate('comments', function(err, rumor) {
    if (err) {return next(err); }

    res.json(rumor);
  });
});


/* PUT upvote rumor */
router.put('/rumors/:rumor/upvote', function(req, res, next) {
  req.rumor.upvote(function(err, rumor){
    if (err) { return next(err); }

    res.json(rumor);
  });
});

/* POST comment */
router.post('/rumors/:rumor/comments', function(req, res, next) {
  var comment = new Comment(req.body);
  comment.rumor = req.rumor;

  comment.save(function(err, comment){
    if(err){ return next(err); }

    req.rumor.comments.push(comment);
    req.rumor.save(function(err, post) {
      if(err){ return next(err); }

      res.json(comment);
    });
  });
});

/* comment PARAM */
router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

/* PUT upvote comment */
router.put('/rumors/:rumor/comments/:comment/upvote', function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

module.exports = router;
