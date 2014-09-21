'use strict'

angular.module 'meanApp'
.controller 'EditProviderCtrl', ($scope, ProviderStor) ->
  console.log 'EditCtrl provider'
  $scope.user = ProviderStor.provider
