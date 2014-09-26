'use strict'

angular.module 'meanApp'
.controller 'UserEditCtrl', ($scope, $stateParams, Users) ->
  $scope.user = Users.user $stateParams.id
  $scope.message = 'Hello'