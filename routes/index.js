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
  res.json(req.rumor);
});


/* PUT upvote rumor */
router.put('/rumors/:rumor/upvote', function(req, res, next) {
  req.rumor.upvote(function(err, rumor){
    if (err) { return next(err); }

    res.json(rumor);
  });
});

module.exports = router;
