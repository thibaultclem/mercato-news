//Include https://github.com/angular-ui/AngularJS-Atom snippet shortcuts

var app = angular.module('mercatoNews', ['ui.router']); //ngma

app.controller('MainCtrl', [
  '$scope',
  'rumors',
  function($scope, rumors) { //ngdlf

    $scope.test = "Hello world !"; //ngv
    $scope.rumors = rumors.rumors;

    $scope.addRumor = function() { //ngf
      if (!$scope.title || $scope.title === '') { return; }//prevent blank title post by user
      $scope.rumors.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: []
      });
      $scope.title = '' //blank title input once it has been added to the posts array
      $scope.link = ''
    };

    $scope.upvoteRumor = function(post) {
      post.upvotes += 1
    };

  }
]);

app.controller('RumorsCtrl', [
  '$scope',
  '$stateParams',
  'rumors',
  function ($scope, $stateParams, rumors) {

    $scope.rumor = rumors.rumors[$stateParams.id];

    $scope.addComment = function() {
      if($scope.body === '') { return; }
      $scope.rumor.comments.push({
        author: 'user',
        body: $scope.body,
        upvotes: 0
      });
      $scope.body = ''
    };

  }
]);

app.factory('rumors', [function() {
  var o = {
    rumors: [
      {title: 'Ibrahimovic in Arsenal', link: 'http://metro.co.uk/2016/04/28/arsenal-to-offer-two-year-contract-to-seal-transfer-of-zlatan-ibrahimovic-5846727/', upvotes: 5, comments: []},
      {title: 'Neymar in Paris Saint Germain', link: 'http://www.mercatoparis.fr/neymar-psg', upvotes: 2, comments: []},
      {title: 'Messi in FC Nantes', upvotes: 14, comments: []},
      {title: 'Pogba in Bayern', upvotes: 7, comments: []},
      {title: 'Kante in Manchester', link: 'https://www.theguardian.com/football/2016/may/26/football-transfer-rumours-manchester-united-ngolo-kante', upvotes: 11, comments: []}
    ]
  };
  return o;
}]);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '../templates/home.html',
      controller: 'MainCtrl'
    })
    .state('rumors', {
      url: '/rumors/{id}',
      templateUrl: '../templates/rumors.html',
      controller: 'RumorsCtrl'
    });

    $urlRouterProvider.otherwise('home')

  }
]);