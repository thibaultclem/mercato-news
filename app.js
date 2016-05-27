var app = angular.module('mercatoNews', [])

app.controller('MainCtrl', [
  '$scope',
  function($scope) {
    $scope.test = "Hello world !"
  }
])
