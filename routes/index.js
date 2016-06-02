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

module.exports = router;
