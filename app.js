//Include https://github.com/angular-ui/AngularJS-Atom snippet shortcuts

var app = angular.module('mercatoNews', []) //ngma

app.controller('MainCtrl', [
  '$scope',
  function($scope) { //ngdlf
    $scope.test = "Hello world !"; //ngv
    $scope.rumors = [
      {title: 'Ibrahimovic in Arsenal', upvotes: 5},
      {title: 'Neymar in Paris Saint Germain', upvotes: 2},
      {title: 'Messi in FC Nantes', upvotes: 14},
      {title: 'Pogba in Bayern', upvotes: 7},
      {title: 'Kante in Manchester', upvotes: 5}
    ];
  }
])
