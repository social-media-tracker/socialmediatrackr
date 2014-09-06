'use strict'

angular.module 'meanApp'
.controller 'ActivityCtrl', ($scope, $http, $state, Activity) ->
  $scope.message = 'Hello'
  $scope.logs = Activity.query();
  $scope.showTable = ->
    if $state.includes('activity.view')
      console.log('hiding table')
      return false 

    x = $scope.logs?.length > 0
    if x 
      console.log 'showing table'
      return true
    else
      console.log 'no logs to show'
      return false
