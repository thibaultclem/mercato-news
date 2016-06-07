var express = require('express');
var router = express.Router();
//DB
var mongoose = require('mongoose');
//model
var Comment = mongoose.model('Comment')
var Rumor = mongoose.model('Rumor')
var Rumor = mongoose.model('User')
//auth
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'}); //use the same secret as the one in models/User.js

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
router.post('/rumors', auth, function(req, res, next) {
  var rumor = new Rumor(req.body);
  rumor.author = req.payload.username;

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
router.put('/rumors/:rumor/upvote', auth, function(req, res, next) {
  req.rumor.upvote(function(err, rumor){
    if (err) { return next(err); }

    res.json(rumor);
  });
});

/* POST comment */
router.post('/rumors/:rumor/comments', auth, function(req, res, next) {
  var comment = new Comment(req.body);
  comment.rumor = req.rumor;
  comment.author = req.payload.username;

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
router.put('/rumors/:rumor/comments/:comment/upvote', auth, function(req, res, next) {
  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

/* POST register user */
router.post('/register', auth, function(req, res, next) {

  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;
  user.setPassword(req.body.password);

  user.save(function(err, comment) {
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

/* POST log user */
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;
