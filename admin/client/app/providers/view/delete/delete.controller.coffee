'use strict'

angular.module 'meanApp'
.controller 'DeleteCtrl', ($scope, $http, ProviderStor, $state) ->
  $scope.user = ProviderStor.provider
  $scope.deleting = false
  $scope.confirmDelete = ->
    if confirm 'Are you absolutely positive? This cannot be undone!!\n\n(consider making a backup of the database first.)\n'
      $scope.deleting = true
      $http.delete('/api/users/' + $scope.user._id).then (res) ->
        window.location.href = '/providers'; #$state.go('providers')


