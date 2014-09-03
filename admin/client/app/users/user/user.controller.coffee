'use strict'

angular.module 'meanApp'
.controller 'UserCtrl', ($scope, $rootScope, $http, $stateParams, $timeout) ->
  id = $stateParams.id
  $scope.userTab = 'activity'
  $http.get '/api/users/' + id
  .then (res) ->
    $scope.user = res.data
    console.log $scope.user
    $rootScope.selectedUser = res.data._id

  $scope.saveUser = (u) ->
    if (u.newPword && u.newPword != u.newPword_c)
      return alert('Passwords do not match.')

    $http.put('/api/users/' + id, u)
    .then (res) ->
      d = res.data
      return alert(d.error) if d.error
      $scope.user.newPword = ''
      $scope.user.newPword_c = ''





  