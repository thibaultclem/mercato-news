//Include https://github.com/angular-ui/AngularJS-Atom snippet shortcuts

var app = angular.module('mercatoNews', []) //ngma

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
        upvotes: 0
      });
      $scope.title = '' //blank title input once it has been added to the posts array
      $scope.link = ''
    };
    $scope.upvoteRumor = function(post) {
      post.upvotes += 1
    };
  }
])

app.factory('rumors', [function() {
  var o = {
    rumors: [
      {title: 'Ibrahimovic in Arsenal', link: 'http://metro.co.uk/2016/04/28/arsenal-to-offer-two-year-contract-to-seal-transfer-of-zlatan-ibrahimovic-5846727/', upvotes: 5},
      {title: 'Neymar in Paris Saint Germain', link: 'http://www.mercatoparis.fr/neymar-psg', upvotes: 2},
      {title: 'Messi in FC Nantes', upvotes: 14},
      {title: 'Pogba in Bayern', upvotes: 7},
      {title: 'Kante in Manchester', link: 'https://www.theguardian.com/football/2016/may/26/football-transfer-rumours-manchester-united-ngolo-kante', upvotes: 11}
    ]
  };
  return o;
}])
