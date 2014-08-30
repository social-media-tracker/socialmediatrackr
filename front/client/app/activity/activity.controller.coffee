'use strict'

angular.module 'meanApp'
.controller 'ActivityCtrl', ($scope, $http) ->
  $scope.message = 'Hello'
  $http.get('/api/logs').then (res) ->
  	return alert(res.data.error) if res.data.error
  	$scope.logs = res.data
