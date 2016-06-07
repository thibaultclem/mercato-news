//Include https://github.com/angular-ui/AngularJS-Atom snippet shortcuts

var app = angular.module('mercatoNews', ['ui.router']); //ngma

app.controller('MainCtrl', [
  '$scope',
  'rumors',
  'auth',
  function($scope, rumors, auth) { //ngdlf

    $scope.test = "Hello world !"; //ngv
    $scope.rumors = rumors.rumors;
    $scope.isLoggedIn = auth.isLoggedIn;

    $scope.addRumor = function() { //ngf
      if (!$scope.title || $scope.title === '') { return; }//prevent blank title post by user
      rumors.create({
        title: $scope.title,
        link: $scope.link
      });
      $scope.title = '' //blank title input once it has been added to the posts array
      $scope.link = ''
    };

    $scope.upvoteRumor = function(rumor) {
      rumors.upvote(rumor);
    };

  }
]);

app.controller('RumorsCtrl', [
  '$scope',
  'rumors',
  'rumor',
  'auth',
  function ($scope, rumors, rumor, auth) {

    $scope.rumor = rumor;
    $scope.isLoggedIn = auth.isLoggedIn;

    $scope.addComment = function() {
      if($scope.body === '') { return; }
      rumors.addComment(rumor._id, {
        author: 'user',
        body: $scope.body
      }).success(function(comment){
        $scope.rumor.comments.push(comment);
      });
      $scope.body = ''
    };

    $scope.upvoteComment = function(comment) {
      rumors.upvoteComment(rumor, comment);
    };

  }
]);

app.controller('AuthCtrl', [
  '$scope',
  '$state',
  'auth',
  function($scope, $state, auth){
    $scope.user = {};

    $scope.register = function(){
      auth.register($scope.user).error(function(error){
        $scope.error = error;
      }).then(function(){
        $state.go('home');
      });
    };

    $scope.logIn = function(){
      auth.logIn($scope.user).error(function(error){
        $scope.error = error;
      }).then(function(){
        $state.go('home');
      });
    };
  }
]);

app.controller('NavCtrl', [
  '$scope',
  'auth',
  function($scope, auth){
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
  }
]);

app.factory('rumors', ['$http', 'auth', function($http, auth) {
  var o = {
    rumors: []
  };

  o.getAll = function() {
    return $http.get('/rumors').success(function(data){
      angular.copy(data, o.rumors);
    });
  };

  o.get = function(id) {
    return $http.get('/rumors/' + id).then(function(res){
      return res.data;
    });
  };

  o.create = function(rumor) {
    return $http.post('/rumors', rumor, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      o.rumors.push(data);
    });
  };

  o.upvote = function(rumor) {
    return $http.put('/rumors/' + rumor._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      rumor.upvotes += 1;
    });
  };

  o.addComment = function(id, comment) {
    return $http.post('/rumors/' + id + '/comments', comment, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    });
  };

  o.upvoteComment = function(rumor, comment) {
    return $http.put('/rumors/' + rumor._id + '/comments/' + comment._id + '/upvote', null, {
      headers: {Authorization: 'Bearer '+auth.getToken()}
    }).success(function(data){
      comment.upvotes += 1;
    });
  };

  return o;
}
]);

app.factory('auth', ['$http', '$window', function($http, $window){
  var auth = {};

  auth.saveToken = function (token){
    $window.localStorage['mercato-news-token'] = token;
  };

  auth.getToken = function (){
    return $window.localStorage['mercato-news-token'];
  };

  auth.isLoggedIn = function(){
    var token = auth.getToken();

    if(token){
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function(){
    if(auth.isLoggedIn()){
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function(user){
    return $http.post('/register', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function(user){
    return $http.post('/login', user).success(function(data){
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function(){
    $window.localStorage.removeItem('mercato-news-token');

  };

  return auth;
}
]);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '../templates/home.html',
      controller: 'MainCtrl',
      resolve: {
        rumorPromise: ['rumors', function(rumors){
          return rumors.getAll();
        }]
      }
    })
    .state('rumors', {
      url: '/rumors/{id}',
      templateUrl: '../templates/rumors.html',
      controller: 'RumorsCtrl',
      resolve: {
        rumor: ['$stateParams', 'rumors', function($stateParams, rumors) {
          return rumors.get($stateParams.id);
        }]
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '../templates/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    })
    .state('register', {
      url: '/register',
      templateUrl: '../templates/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth){
        if(auth.isLoggedIn()){
          $state.go('home');
        }
      }]
    });

    $urlRouterProvider.otherwise('home')

  }
]);
