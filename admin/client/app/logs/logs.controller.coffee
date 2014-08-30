'use strict'

angular.module 'meanApp'
.controller 'LogsCtrl', ($scope, $http) ->
  $scope.message = 'Hello'
  $http.get('/api/logs').then (res) ->
  	console.log res
  	return alert(res.data.error) if res.data.error
  	$scope.logs = res.data
