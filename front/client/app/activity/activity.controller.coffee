'use strict'

angular.module 'meanApp'
.controller 'ActivityCtrl', ($scope, $http, $state, Activity) ->
  $scope.message = 'Hello'
  $scope.logs = Activity.query();
  $scope.showTable = ->
    if $state.includes('activity.view')
      return false 
    if $scope.logs?.length > 0 
      return true
    else
      return false
